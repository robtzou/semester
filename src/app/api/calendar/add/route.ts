import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";
import { Course } from "@/types";

const dayMap: Record<string, string> = {
    "Mon": "MO",
    "Tue": "TU",
    "Wed": "WE",
    "Thu": "TH",
    "Fri": "FR",
    "Sat": "SA",
    "Sun": "SU"
};

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { courses, startDate, endDate } = await req.json();

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: session.accessToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const results = [];

        for (const course of courses as Course[]) {
            // Calculate the first occurrence of the course
            // We need to find the first date >= startDate that matches one of the course days
            // For simplicity, we'll just set the startDateTime to the first occurrence

            // Parse start date
            const semesterStart = new Date(startDate);

            // Create recurrence rule
            const byDay = course.days.map(d => dayMap[d]).filter(Boolean).join(",");
            // Format end date for RRULE (YYYYMMDD)
            const until = endDate.replace(/-/g, "");

            const rrule = `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}T235959Z`;

            // We need to determine the actual start date-time for the first event
            // This is complex because the semester start might not be the first day of class
            // However, Google Calendar handles this if we set the start date to the semester start
            // BUT, if the semester starts on Tuesday and the class is Monday, the first event should be next Monday?
            // Actually, if we set startDateTime to the semester start date + time, and use RRULE, 
            // Google Calendar will only show instances that match the rule.
            // Wait, no. The start time of the event MUST match the recurrence pattern start?
            // If I say "Start on Jan 1 (Wed) at 10am, Repeat every Mon, Wed", it works.
            // If I say "Start on Jan 1 (Wed) at 10am, Repeat every Mon", the first event is... tricky.
            // It's safer to find the first correct day.

            // Let's find the first day of the course
            let firstDate = new Date(semesterStart);
            const targetDays = course.days.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(d));

            while (!targetDays.includes(firstDate.getDay())) {
                firstDate.setDate(firstDate.getDate() + 1);
            }

            // Set time
            const [startHour, startMinute] = course.startTime.split(":").map(Number);
            const [endHour, endMinute] = course.endTime.split(":").map(Number);

            const startDateTime = new Date(firstDate);
            startDateTime.setHours(startHour, startMinute, 0);

            const endDateTime = new Date(firstDate);
            endDateTime.setHours(endHour, endMinute, 0);

            const event = {
                summary: `${course.code} - ${course.name}`,
                location: course.location,
                description: `Course: ${course.name}\nCode: ${course.code}`,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: "America/New_York", // Should ideally come from user or browser
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: "America/New_York",
                },
                recurrence: [rrule],
            };

            const response = await calendar.events.insert({
                calendarId: "primary",
                requestBody: event,
            });

            results.push(response.data);
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error("Error adding to calendar:", error);
        return NextResponse.json({ error: "Failed to add events" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// In a real app, you would use process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;

        if (!file || !startDate || !endDate) {
            return NextResponse.json(
                { error: "Missing file or dates" },
                { status: 400 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        // Mock response if no API key is present
        if (!process.env.GEMINI_API_KEY) {
            console.log("No API key found, returning mock data");
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
            return NextResponse.json({
                courses: [
                    {
                        id: "1",
                        code: "CS 101",
                        name: "Intro to Computer Science",
                        startTime: "10:00",
                        endTime: "11:30",
                        days: ["Mon", "Wed"],
                        location: "Science Hall 101",
                    },
                    {
                        id: "2",
                        code: "MATH 201",
                        name: "Calculus II",
                        startTime: "13:00",
                        endTime: "14:30",
                        days: ["Tue", "Thu"],
                        location: "Math Building 204",
                    },
                    {
                        id: "3",
                        code: "PHYS 101",
                        name: "General Physics I",
                        startTime: "09:00",
                        endTime: "10:30",
                        days: ["Fri"],
                        location: "Physics Lab 3B",
                    },
                ],
            });
        }

        // Real Gemini implementation
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      Analyze this course schedule image. 
      The semester starts on ${startDate} and ends on ${endDate}.
      Extract the following details for each course:
      - Course Code (e.g. CS 101)
      - Course Name
      - Start Time (24h format, e.g. 14:30)
      - End Time (24h format)
      - Days of the week (e.g. ["Mon", "Wed"])
      - Location
      
      Return ONLY a valid JSON array of objects with these keys: id (random string), code, name, startTime, endTime, days, location.
      Do not include markdown formatting or code blocks.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up the response if it contains markdown code blocks
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const courses = JSON.parse(cleanText);

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("Error parsing schedule:", error);
        return NextResponse.json(
            { error: "Failed to parse schedule" },
            { status: 500 }
        );
    }
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Upload, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { ImageUpload } from "@/components/ImageUpload";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CourseReview } from "@/components/CourseReview";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

export default function Home() {
    const { data: session } = useSession();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [dates, setDates] = useState({ start: "", end: "" });
    const [isProcessing, setIsProcessing] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);

    const handleImageSelect = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const handleProcess = async () => {
        if (!file || !dates.start || !dates.end) return;

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("startDate", dates.start);
            formData.append("endDate", dates.end);

            const response = await fetch("/api/parse-schedule", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process schedule");
            }

            const data = await response.json();
            setCourses(data.courses);
            setStep(2);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to process schedule. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSync = async () => {
        if (!session) {
            signIn("google");
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch("/api/calendar/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courses,
                    startDate: dates.start,
                    endDate: dates.end,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync to calendar");
            }

            setStep(3);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to sync to calendar. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 overflow-hidden relative">

            {/* Hero Section */}
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-xl mb-4">
                        ✨ AI-Powered Schedule Sync
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
                        Semester Sync
                    </h1>
                    <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
                        Upload a screenshot of your course schedule and let our agent instantly sync it to your Google Calendar.
                    </p>
                </motion.div>

                {/* Main Action Area */}
                <motion.div
                    layout
                    className="w-full max-w-4xl mt-12"
                >
                    <div className="glass-card rounded-3xl p-8 md:p-12 min-h-[400px] border-white/10 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col gap-8 items-center"
                                >
                                    <ImageUpload onImageSelect={handleImageSelect} />

                                    <div className="w-full max-w-xl border-t border-white/10 pt-8">
                                        <DateRangePicker
                                            startDate={dates.start}
                                            endDate={dates.end}
                                            onStartDateChange={(d) => setDates(prev => ({ ...prev, start: d }))}
                                            onEndDateChange={(d) => setDates(prev => ({ ...prev, end: d }))}
                                        />
                                    </div>

                                    <button
                                        onClick={handleProcess}
                                        disabled={!file || !dates.start || !dates.end || isProcessing}
                                        className="w-full max-w-xl mt-4 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Processing Schedule...
                                            </>
                                        ) : (
                                            <>
                                                Continue to Review
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col gap-8 items-center w-full"
                                >
                                    <CourseReview courses={courses} onCoursesChange={setCourses} />

                                    <div className="flex gap-4 w-full max-w-3xl">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSync}
                                            disabled={isProcessing}
                                            className="flex-[2] py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Syncing to Calendar...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm & Sync
                                                    <Calendar className="h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6"
                                >
                                    <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
                                        <CheckCircle className="h-12 w-12" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Schedule Synced!</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        Your courses have been successfully added to your Google Calendar.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setFile(null);
                                            setCourses([]);
                                        }}
                                        className="px-8 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                                    >
                                        Sync Another Schedule
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
                >
                    {[
                        { icon: Upload, title: "Upload Image", desc: "Take a screenshot of your portal" },
                        { icon: CheckCircle, title: "Verify Details", desc: "Review parsed course data" },
                        { icon: Calendar, title: "Sync Calendar", desc: "Instantly added to GCal" },
                    ].map((feature, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-white/5 hover:bg-white/5 transition-colors">
                            <feature.icon className="h-8 w-8 mb-4 text-primary" />
                            <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}

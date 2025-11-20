"use client";

import { Course } from "@/types";
import { Clock, MapPin, Calendar, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseReviewProps {
    courses: Course[];
    onCoursesChange: (courses: Course[]) => void;
}

export function CourseReview({ courses, onCoursesChange }: CourseReviewProps) {
    const removeCourse = (id: string) => {
        onCoursesChange(courses.filter(c => c.id !== id));
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Review Courses</h3>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Course
                </button>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-6 rounded-2xl relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                                            {course.code}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-semibold">{course.name}</h4>
                                </div>
                                <button
                                    onClick={() => removeCourse(course.id)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-white/50" />
                                    <span>{course.startTime} - {course.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-white/50" />
                                    <div className="flex gap-1">
                                        {course.days.map(day => (
                                            <span key={day} className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-white/80">
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-white/50" />
                                    <span>{course.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

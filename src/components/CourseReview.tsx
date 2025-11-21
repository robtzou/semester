"use client";

import { useState } from "react";

import { Course } from "@/types";
import { Clock, MapPin, Calendar, Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseReviewProps {
    courses: Course[];
    onCoursesChange: (courses: Course[]) => void;
}

export function CourseReview({ courses, onCoursesChange }: CourseReviewProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Course | null>(null);

    const removeCourse = (id: string) => {
        onCoursesChange(courses.filter(c => c.id !== id));
    };

    const startEditing = (course: Course) => {
        setEditingId(course.id);
        setEditForm({ ...course });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const saveEditing = () => {
        if (editForm) {
            onCoursesChange(courses.map(c => c.id === editForm.id ? editForm : c));
            setEditingId(null);
            setEditForm(null);
        }
    };

    const toggleDay = (day: string) => {
        if (!editForm) return;
        const days = editForm.days.includes(day)
            ? editForm.days.filter(d => d !== day)
            : [...editForm.days, day];
        setEditForm({ ...editForm, days });
    };

    const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr"];

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Course Review: Add location and course name</h3>
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
                            {editingId === course.id && editForm ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editForm.code}
                                                    onChange={e => setEditForm({ ...editForm, code: e.target.value })}
                                                    className="w-24 px-2 py-1 rounded-md bg-white/50 border border-black/10 text-sm font-bold text-primary"
                                                    placeholder="Code"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="flex-1 px-2 py-1 rounded-md bg-white/50 border border-black/10 text-sm font-semibold"
                                                    placeholder="Course Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={saveEditing}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-black/50" />
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="time"
                                                    value={editForm.startTime}
                                                    onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                                    className="px-1 py-0.5 rounded bg-white/50 border border-black/10 text-xs"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="time"
                                                    value={editForm.endTime}
                                                    onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                                    className="px-1 py-0.5 rounded bg-white/50 border border-black/10 text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-black/50" />
                                            <div className="flex gap-1">
                                                {WEEKDAYS.map(day => (
                                                    <button
                                                        key={day}
                                                        onClick={() => toggleDay(day)}
                                                        className={`px-1.5 py-0.5 rounded text-xs transition-colors ${editForm.days.includes(day)
                                                            ? "bg-primary text-black/20"
                                                            : "bg-black/5 text-black hover:bg-black/10"
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-black/50" />
                                            <input
                                                type="text"
                                                value={editForm.location}
                                                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                                className="w-full px-2 py-1 rounded-md bg-white/50 border border-black/10 text-sm"
                                                placeholder="Location"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                                                    {course.code}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-semibold">{course.name}</h4>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => startEditing(course)}
                                                className="text-muted-foreground hover:text-primary transition-colors p-2"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => removeCourse(course.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-black">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-black/50" />
                                            <span>{course.startTime} - {course.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-black/50" />
                                            <div className="flex gap-1">
                                                {course.days.map(day => (
                                                    <span key={day} className="bg-black/5 px-1.5 py-0.5 rounded text-xs text-black">
                                                        {day}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-black/50" />
                                            <span>{course.location}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

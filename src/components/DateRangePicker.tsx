"use client";

import { Calendar as CalendarIcon } from "lucide-react";

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export function DateRangePicker({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: DateRangePickerProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mx-auto">
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Semester Start</label>
                <div className="relative group">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-white [color-scheme:dark]"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Semester End</label>
                <div className="relative group">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-white [color-scheme:dark]"
                    />
                </div>
            </div>
        </div>
    );
}

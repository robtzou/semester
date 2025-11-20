"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageSelect(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1
    });

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-black/4 rounded-3xl">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-8",
                    isDragActive ? "border-primary bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                    preview ? "border-solid border-white/10 p-0" : ""
                )}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full min-h-[300px] "
                        >
                            <img
                                src={preview}
                                alt="Schedule Preview"
                                className="w-full h-full object-contain rounded-2xl"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-medium">Click to change</p>
                            </div>
                            <button
                                onClick={clearImage}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-red-500/80 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-8 w-8 text-white/70" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Upload Schedule</h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to browse
                                </p>
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground/50">
                                <span className="px-2 py-1 rounded-md bg-white/5">PNG</span>
                                <span className="px-2 py-1 rounded-md bg-white/5">JPG</span>
                                <span className="px-2 py-1 rounded-md bg-white/5">WEBP</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

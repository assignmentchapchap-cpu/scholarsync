'use client';

import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface InstructorVisualPlaceholderProps {
    label: string;
    className?: string;
    minHeight?: string;
}

export function InstructorVisualPlaceholder({
    label,
    className,
    minHeight = "min-h-[300px]"
}: InstructorVisualPlaceholderProps) {
    return (
        <div className={cn(
            "w-full h-full rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-rose-50 hover:border-rose-300",
            minHeight,
            className
        )}>
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-rose-500">
                <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-rose-900 font-medium text-lg max-w-[80%]">
                {label}
            </p>
            <p className="text-rose-400 text-sm mt-2 font-mono uppercase tracking-wider">
                Visual Placeholder
            </p>
        </div>
    );
}

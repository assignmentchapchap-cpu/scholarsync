'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, disabled = false }: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, char: string) => {
        if (!/^\d*$/.test(char)) return; // Only allow digits

        const newValue = value.split('');
        newValue[index] = char.substring(char.length - 1); // Take last char if multiple
        const finalValue = newValue.join('').substring(0, length);

        onChange(finalValue);

        // Auto-focus next input
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const importFromClipboard = (pastedData: string) => {
        const cleanData = pastedData.replace(/\D/g, '').slice(0, length);
        if (cleanData) {
            onChange(cleanData);
            // Focus the input after the last filled character
            const nextIndex = Math.min(cleanData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            // Backspace on empty input -> move previous
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain');
        importFromClipboard(pastedData);
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={cn(
                        "w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold rounded-md border border-slate-300 bg-white shadow-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
                        value[index] ? "border-indigo-500 ring-1 ring-indigo-500/20" : ""
                    )}
                />
            ))}
        </div>
    );
}

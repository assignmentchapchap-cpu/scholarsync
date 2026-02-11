'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, InputProps } from '@/components/ui/Input';

interface PasswordInputProps extends InputProps {
    showStrength?: boolean;
}

export function PasswordInput({ className, showStrength = false, value, onChange, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const password = value?.toString() || '';

    // Strength checks
    // Strength checks
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    // Special char optional/removed from core requirement based on user request
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthScore = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length;

    const getStrengthColor = () => {
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore === 3) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthLabel = () => {
        if (strengthScore <= 2) return 'Weak';
        if (strengthScore === 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-10", className)} // Padding for icon
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            {showStrength && password.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300", getStrengthColor())}
                            style={{ width: `${(strengthScore / 4) * 100}%` }}
                        />
                    </div>

                    {/* Requirements List */}
                    <div className="grid grid-cols-2 gap-1">
                        <Requirement label="6+ characters" met={hasMinLength} />
                        <Requirement label="Uppercase" met={hasUpperCase} />
                        <Requirement label="Lowercase" met={hasLowerCase} />
                        <Requirement label="Number" met={hasNumber} />
                    </div>
                </div>
            )}
        </div>
    );
}

function Requirement({ label, met }: { label: string; met: boolean }) {
    return (
        <div className={cn("flex items-center gap-1.5 text-xs transition-colors", met ? "text-emerald-600" : "text-slate-400")}>
            {met ? <Check className="w-3 h-3" /> : <div className="w-1 h-1 rounded-full bg-slate-300 ml-1" />}
            {label}
        </div>
    );
}

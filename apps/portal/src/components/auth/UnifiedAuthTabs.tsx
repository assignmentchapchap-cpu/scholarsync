'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import InstructorLoginForm from './InstructorLoginForm';
import StudentLoginForm from './StudentLoginForm';

export default function UnifiedAuthTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    // Default to instructor if no role specified, or match param
    const activeTab = (roleParam === 'student' ? 'student' : 'instructor');

    const handleTabChange = (tab: 'instructor' | 'student') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('role', tab);

        // Optional: Decide if we want to reset 'view' when switching tabs or keep it?
        // User asked for "same logic", usually one expects to stay in "login" or "signup" mode when switching tabs.
        // Let's preserve it. The current params copy does that automatically.

        router.push(`/login?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-8 relative">
                <button
                    onClick={() => handleTabChange('instructor')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200",
                        activeTab === 'instructor'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Instructor
                </button>
                <button
                    onClick={() => handleTabChange('student')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200",
                        activeTab === 'student'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <GraduationCap className="w-4 h-4" />
                    Student
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
                <div className={cn(
                    "transition-opacity duration-300",
                    activeTab === 'instructor' ? "block" : "hidden"
                )}>
                    <InstructorLoginForm />
                </div>

                <div className={cn(
                    "transition-opacity duration-300",
                    activeTab === 'student' ? "block" : "hidden"
                )}>
                    <StudentLoginForm />
                </div>
            </div>
        </div>
    );
}

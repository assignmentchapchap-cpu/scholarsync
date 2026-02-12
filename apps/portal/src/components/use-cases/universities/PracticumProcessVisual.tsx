"use client";

import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Upload, Mail, CheckSquare } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
    {
        id: 1,
        title: "Cohort Creation",
        description: "Instructor defines attachment period, requirements, and grading criteria.",
        icon: Users
    },
    {
        id: 2,
        title: "Student Enrollment",
        description: "Students fill digital enrollment forms and select their industry placement.",
        icon: FileText
    },
    {
        id: 3,
        title: "Placement Approval",
        description: "Faculty reviews and approves student placements before start date.",
        icon: CheckCircle
    },
    {
        id: 4,
        title: "Logbook Submission",
        description: "Students submit daily logs, weekly reports, and final project via mobile.",
        icon: Upload
    },
    {
        id: 5,
        title: "Supervisor Verification",
        description: "Industry supervisors receive automated email requests to verify logs.",
        icon: Mail
    },
    {
        id: 6,
        title: "Final Grading",
        description: "Instructor reviews verified logs and supervisor feedback to assign grade.",
        icon: CheckSquare
    }
];

export const PracticumProcessVisual = () => {
    const [activeStep, setActiveStep] = useState(1);

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 text-center">
                <h3 className="text-emerald-800 font-bold mb-1">Practicum Workflow</h3>
                <p className="text-emerald-600 text-xs uppercase tracking-wider font-semibold">Interactive Process</p>
            </div>

            <div className="p-2">
                {steps.map((step, index) => {
                    const isActive = activeStep === step.id;
                    const isCompleted = activeStep > step.id;

                    return (
                        <div
                            key={step.id}
                            onMouseEnter={() => setActiveStep(step.id)}
                            className={cn(
                                "relative flex items-start gap-4 p-3 rounded-xl transition-all duration-300 cursor-default mb-2 last:mb-0 group",
                                isActive ? "bg-amber-50 shadow-sm ring-1 ring-amber-200" : "hover:bg-slate-50"
                            )}
                        >
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "absolute left-[27px] top-[44px] bottom-[-8px] w-0.5 z-0 transition-colors duration-500",
                                    isCompleted ? "bg-emerald-200" : "bg-slate-100"
                                )} />
                            )}

                            {/* Icon Bubble */}
                            <div className={cn(
                                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                                isActive ? "bg-amber-100 text-amber-600" :
                                    isCompleted ? "bg-emerald-100 text-emerald-600" :
                                        "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            )}>
                                <step.icon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={cn(
                                        "font-bold text-sm transition-colors",
                                        isActive ? "text-amber-900" :
                                            isCompleted ? "text-emerald-900" : "text-slate-500"
                                    )}>
                                        {step.title}
                                    </h4>
                                    {isActive && (
                                        <span className="text-[10px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-full shadow-sm border border-amber-100 animate-in fade-in zoom-in duration-300">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <p className={cn(
                                    "text-xs leading-relaxed transition-all duration-300",
                                    isActive ? "text-slate-600 max-h-20 opacity-100" : "text-slate-400 max-h-0 opacity-0 overflow-hidden"
                                )}>
                                    {step.description}
                                </p>

                                {!isActive && (
                                    <p className="text-xs text-slate-400 truncate mt-1 group-hover:text-slate-500 transition-colors">
                                        Hover to view details...
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save, Loader2, Upload, AlertCircle, Plus } from 'lucide-react';
import { createClient } from "@schologic/database";
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import { PracticumLogEntry, LogTemplateType, LogFrequency } from '@/types/practicum';
import { useRouter } from 'next/navigation';

interface LogEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    practicumId: string;
    templateType: LogTemplateType;
    logInterval: LogFrequency;
    weekNumber?: number;
    initialDate?: string; // Specific date being edited
    initialData?: PracticumLogEntry; // Data for that day
    onSuccess?: () => void;
}

export default function LogEntryModal({
    isOpen, onClose, practicumId, templateType, logInterval,
    weekNumber, initialDate, initialData, onSuccess
}: LogEntryModalProps) {
    const { showToast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const [submitting, setSubmitting] = useState(false);

    // State is always single-day now
    const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const [clockIn, setClockIn] = useState('08:00');
    const [clockOut, setClockOut] = useState('17:00');
    const [entry, setEntry] = useState<PracticumLogEntry>(initialData || {});

    // Reset state when opening/changing target
    useEffect(() => {
        if (isOpen) {
            setDate(initialDate || new Date().toISOString().split('T')[0]);
            setEntry(initialData || {});

            // Extract time if exists in initialData?? 
            // Currently initialData is just the fields, times are separate columns usually.
            // But for composite sub-entries, they might be in the object.
            // For now default to 8-5.
        }
    }, [isOpen, initialDate, initialData]);

    const handleChange = (field: keyof PracticumLogEntry, value: string) => {
        setEntry(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent | null, mode: 'exit' | 'new' = 'exit') => {
        if (e) e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Payload Prep
            const clockInIso = new Date(`${date}T${clockIn}`).toISOString();
            const clockOutIso = new Date(`${date}T${clockOut}`).toISOString();

            const payload: any = {
                student_id: user.id,
                practicum_id: practicumId,
                submission_status: 'draft',
                log_date: date,
            };

            if (logInterval === 'daily') {
                // Standard Daily Log
                Object.assign(payload, {
                    clock_in: clockInIso,
                    clock_out: clockOutIso,
                    entries: entry
                });

                // Upsert on Date + Student + Practicum
                // We need a unique constraint or just check existence.
                const { error } = await supabase.from('practicum_logs').upsert(payload, { onConflict: 'student_id, practicum_id, log_date' });
                if (error) throw error;

            } else {
                // Composite Upsert Logic (Weekly/Monthly)
                // 1. Find the container
                let query = supabase.from('practicum_logs')
                    .select('*')
                    .eq('student_id', user.id)
                    .eq('practicum_id', practicumId);

                if (weekNumber) query = query.eq('week_number', weekNumber);

                const { data: existing } = await query.single();

                let newEntries: any = existing?.entries || { days: [] };
                if (!newEntries.days) newEntries.days = [];

                // 2. Merge this day
                const dayIndex = newEntries.days.findIndex((d: any) => d.date === date);
                const dayData = { date, ...entry };

                if (dayIndex >= 0) newEntries.days[dayIndex] = dayData;
                else newEntries.days.push(dayData);

                // Sort
                newEntries.days.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

                const compositePayload = {
                    student_id: user.id,
                    practicum_id: practicumId,
                    week_number: weekNumber,
                    log_date: weekNumber ? new Date().toISOString() : date,
                    submission_status: 'draft',
                    entries: newEntries
                };

                // Upsert on Week Number?? Table doesn't have unique constraint on week_number alone.
                // We rely on ID if exists.
                if (existing?.id) {
                    const { error } = await supabase.from('practicum_logs').update({ entries: newEntries, submission_status: 'draft' }).eq('id', existing.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('practicum_logs').insert(compositePayload);
                    if (error) throw error;
                }
            }

            showToast("Saved to Draft", "success");

            if (onSuccess) onSuccess(); // Always refresh parent

            if (mode === 'exit') {
                router.refresh(); // Ensure strict refresh
                onClose();
            } else {
                // Reset for new entry
                // Keep date same? Or maybe user wants to add same day different content? 
                // Usually for daily logs it's one per day. For composite, maybe next day?
                // Let's just reset content.
                setEntry({});
                // Note: We don't auto-increment date because that's complex to guess. 
                // User can change date manually.
                router.refresh();
            }

        } catch (error: any) {
            console.error("Log submission error:", error);
            showToast(error.message || "Failed to save draft", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isTeaching = templateType === 'teaching_practice';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[95vh] flex flex-col ring-1 ring-slate-900/5">
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                            {initialData ? 'Edit' : 'New'} Log Entry
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                            <span className="capitalize">{logInterval} Log</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-600 font-semibold">{date}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8 flex-grow">
                    <form id="log-form" className="space-y-8">

                        {/* Logistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-1.5"><Calendar className="w-4 h-4 text-emerald-500" /> Date</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    disabled={!!initialDate}
                                    className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-1.5"><Clock className="w-4 h-4 text-slate-400" /> Start Time</label>
                                <input type="time" required value={clockIn} onChange={e => setClockIn(e.target.value)} className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-1.5"><Clock className="w-4 h-4 text-slate-400" /> End Time</label>
                                <input type="time" required value={clockOut} onChange={e => setClockOut(e.target.value)} className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300" />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100" />

                        {/* Dynamic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isTeaching ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Class Taught</label>
                                        <input required placeholder="e.g. Form 3B" value={entry.class_taught || ''} onChange={e => handleChange('class_taught', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Subject</label>
                                        <input required placeholder="e.g. Mathematics" value={entry.subject_taught || ''} onChange={e => handleChange('subject_taught', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Topic / Sub-topic</label>
                                        <input required placeholder="e.g. Algebra: Linear Equations" value={entry.lesson_topic || ''} onChange={e => handleChange('lesson_topic', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Self-Observation / Remarks</label>
                                        <textarea required placeholder="Reflect on lesson delivery, student engagement, or challenges..." value={entry.observations || ''} onChange={e => handleChange('observations', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400 resize-y min-h-[120px] leading-relaxed"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Department / Section</label>
                                        <input required placeholder="e.g. IT Support" value={entry.department || ''} onChange={e => handleChange('department', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Tasks Performed</label>
                                        <textarea required placeholder="List the main activities you undertook today..." value={entry.tasks_performed || ''} onChange={e => handleChange('tasks_performed', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400 resize-y min-h-[100px] leading-relaxed"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">New Skills / Knowledge Acquired</label>
                                        <textarea required placeholder="What did you learn today?" value={entry.skills_acquired || ''} onChange={e => handleChange('skills_acquired', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400 resize-y min-h-[100px] leading-relaxed"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Challenges Encountered</label>
                                        <textarea placeholder="Describe any difficulties faced..." value={entry.challenges || ''} onChange={e => handleChange('challenges', e.target.value)}
                                            className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 placeholder:text-slate-400 resize-y min-h-[80px] leading-relaxed"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50/50 z-10">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={(e) => handleSubmit(null, 'new')}
                        className="px-6 py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Save & Add New
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={(e) => handleSubmit(null, 'exit')}
                        className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save & Exit
                    </button>
                </div>
            </div>
        </div>
    );
}

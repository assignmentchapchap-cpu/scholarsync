'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save, Loader2, Upload, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from "@schologic/database";
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import { PracticumLogEntry, LogTemplateType, LogFrequency, CompositeLogData } from '@/types/practicum';
import { useRouter } from 'next/navigation';

interface LogEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    practicumId: string;
    templateType: LogTemplateType;
    logInterval: LogFrequency;
    weekNumber?: number; // Pass if creating for specific week
}

export default function LogEntryModal({ isOpen, onClose, practicumId, templateType, logInterval, weekNumber }: LogEntryModalProps) {
    const { showToast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const [submitting, setSubmitting] = useState(false);

    // -- State: Daily Mode --
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [clockIn, setClockIn] = useState('08:00');
    const [clockOut, setClockOut] = useState('17:00');
    const [dailyEntry, setDailyEntry] = useState<PracticumLogEntry>({});

    // -- State: Composite Mode (Weekly/Monthly) --
    // We store an array of daily entries.
    const [compositeDays, setCompositeDays] = useState<PracticumLogEntry[]>([]);
    const [compositeSummary, setCompositeSummary] = useState('');
    const [selectedPeriodLabel, setSelectedPeriodLabel] = useState(''); // e.g. "Week 5" or "October"

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Initialize composite days if needed
            if (logInterval !== 'daily' && compositeDays.length === 0) {
                initializeCompositeDays();
            }
        } else {
            document.body.style.overflow = 'unset';
            // Reset on close? Maybe not to preserve draft state if needed, but for now reset.
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, logInterval]);

    const initializeCompositeDays = () => {
        // Mocking: Generate 5 days for Weekly (Mon-Fri) based on 'now' or 'weekNumber'
        // Ideally this comes from the timeline logic passed in props.
        // For functionality proof: generate "Day 1" to "Day 5" relative to current date (or selected week week).

        let daysToGen = 5; // Default Weekly
        if (logInterval === 'monthly') daysToGen = 20;

        const newDays: PracticumLogEntry[] = [];
        // Just empty placeholders for now, relying on user to set dates or pre-filling logic
        // In a real app, calculate actual dates from Week Number.
        const baseDate = new Date();
        // Logic should align dates to the specific Week Monday.

        for (let i = 0; i < daysToGen; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() - (baseDate.getDay() - 1) + i); // Simple align to Mon + offset
            newDays.push({
                date: d.toISOString().split('T')[0]
            });
        }
        setCompositeDays(newDays);
        setSelectedPeriodLabel(logInterval === 'weekly' ? `Week ${weekNumber || 'Current'}` : 'Current Month');
    };

    const handleDailyChange = (field: keyof PracticumLogEntry, value: string) => {
        setDailyEntry(prev => ({ ...prev, [field]: value }));
    };

    const handleCompositeChange = (index: number, field: keyof PracticumLogEntry, value: string) => {
        setCompositeDays(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            let payload: any = {
                student_id: user.id,
                practicum_id: practicumId,
                supervisor_status: 'pending',
            };

            if (logInterval === 'daily') {
                // Combine Date + Time
                const clockInIso = new Date(`${date}T${clockIn}`).toISOString();
                const clockOutIso = new Date(`${date}T${clockOut}`).toISOString();

                payload = {
                    ...payload,
                    log_date: date,
                    clock_in: clockInIso,
                    clock_out: clockOutIso,
                    entries: dailyEntry,
                    week_number: weekNumber
                };
            } else {
                // Composite
                // For log_date, use the first day or current.
                const logDate = compositeDays[0]?.date || new Date().toISOString().split('T')[0];

                const compositeData: CompositeLogData = {
                    days: compositeDays,
                    summary: compositeSummary,
                    week_number: weekNumber // or derived
                };

                payload = {
                    ...payload,
                    log_date: logDate,
                    week_number: weekNumber,
                    // clock_in/out usually null for weekly/monthly or aggregate
                    weekly_reflection: compositeSummary, // Mapping to schema column
                    entries: compositeData
                };
            }

            const { error } = await supabase
                .from('practicum_logs')
                .insert(payload);

            if (error) throw error;

            showToast("Log entry saved successfully", "success");
            router.refresh();
            onClose();
            // Reset logic omitted for brevity
        } catch (error: any) {
            console.error("Log submission error:", error);
            showToast(error.message || "Failed to save log entry", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isTeaching = templateType === 'teaching_practice';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className={cn("w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[95vh] flex flex-col",
                logInterval !== 'daily' ? "max-w-6xl" : "max-w-2xl" // Wider for Matrix
            )}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-6">
                            New {logInterval === 'daily' ? 'Daily' : logInterval === 'weekly' ? 'Weekly' : 'Monthly'} Log
                        </h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                            Template: {templateType.replace('_', ' ')}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-grow">
                    <form id="log-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* --- DAILY FORM --- */}
                        {logInterval === 'daily' && (
                            <>
                                {/* Logistics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</label>
                                        <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full form-input-clean border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Start</label>
                                        <input type="time" required value={clockIn} onChange={e => setClockIn(e.target.value)} className="w-full form-input-clean border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> End</label>
                                        <input type="time" required value={clockOut} onChange={e => setClockOut(e.target.value)} className="w-full form-input-clean border rounded-lg px-3 py-2" />
                                    </div>
                                </div>

                                {/* Dynamic Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {isTeaching ? (
                                        <>
                                            <div className="md:col-span-2"><label className="field-label">Office / Admin Activities</label><textarea className="field-input min-h-[60px]" placeholder="e.g. Staff meeting" onChange={e => handleDailyChange('office_activities', e.target.value)} /></div>
                                            <div><label className="field-label">Subject</label><input required className="field-input" onChange={e => handleDailyChange('subject_taught', e.target.value)} /></div>
                                            <div><label className="field-label">Class</label><input required className="field-input" onChange={e => handleDailyChange('class_taught', e.target.value)} /></div>
                                            <div className="md:col-span-2"><label className="field-label">Topic / Lesson</label><input required className="field-input" onChange={e => handleDailyChange('lesson_topic', e.target.value)} /></div>
                                            <div className="md:col-span-2"><label className="field-label">Observations (Self-Remarks)</label><textarea required className="field-input min-h-[100px]" onChange={e => handleDailyChange('observations', e.target.value)} /></div>
                                        </>
                                    ) : (
                                        <>
                                            <div><label className="field-label">Department</label><input required className="field-input" onChange={e => handleDailyChange('department', e.target.value)} /></div>
                                            <div><label className="field-label">Tasks Performed</label><textarea required className="field-input" onChange={e => handleDailyChange('tasks_performed', e.target.value)} /></div>
                                            <div className="md:col-span-2"><label className="field-label">New Skills Acquired</label><textarea required className="field-input" onChange={e => handleDailyChange('skills_acquired', e.target.value)} /></div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* --- MATRIX FORM (Weekly/Monthly) --- */}
                        {logInterval !== 'daily' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm">Instruction</h4>
                                        <p className="text-blue-700 text-xs mt-1">
                                            For {logInterval} logs, you must fill out the daily details for each active day.
                                            Scroll vertically to view all days. Ensure every row is complete before submitting.
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-3 w-32 font-bold text-slate-600">Day / Date</th>
                                                    {isTeaching ? (
                                                        <>
                                                            <th className="p-3 w-32 font-bold text-slate-600">Class</th>
                                                            <th className="p-3 w-40 font-bold text-slate-600">Subject</th>
                                                            <th className="p-3 w-48 font-bold text-slate-600">Topic</th>
                                                            <th className="p-3 min-w-[200px] font-bold text-slate-600">Observations</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="p-3 w-48 font-bold text-slate-600">Department</th>
                                                            <th className="p-3 min-w-[200px] font-bold text-slate-600">Main Activity</th>
                                                            <th className="p-3 min-w-[200px] font-bold text-slate-600">Skills Learned</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {compositeDays.map((day, idx) => (
                                                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                                        <td className="p-2 align-top bg-slate-50/50">
                                                            <input
                                                                type="date"
                                                                value={day.date}
                                                                onChange={e => handleCompositeChange(idx, 'date', e.target.value)}
                                                                className="w-full bg-transparent font-bold text-slate-700 text-xs focus:outline-none"
                                                            />
                                                            <span className="text-[10px] text-slate-400 block font-mono">Day {idx + 1}</span>
                                                        </td>
                                                        {isTeaching ? (
                                                            <>
                                                                <td className="p-2 align-top"><input className="table-input" placeholder="Form 3B" value={day.class_taught || ''} onChange={e => handleCompositeChange(idx, 'class_taught', e.target.value)} /></td>
                                                                <td className="p-2 align-top"><input className="table-input" placeholder="Maths" value={day.subject_taught || ''} onChange={e => handleCompositeChange(idx, 'subject_taught', e.target.value)} /></td>
                                                                <td className="p-2 align-top"><input className="table-input" placeholder="Algebra" value={day.lesson_topic || ''} onChange={e => handleCompositeChange(idx, 'lesson_topic', e.target.value)} /></td>
                                                                <td className="p-2 align-top"><textarea className="table-input min-h-[60px]" placeholder="Remarks..." value={day.observations || ''} onChange={e => handleCompositeChange(idx, 'observations', e.target.value)} /></td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="p-2 align-top"><input className="table-input" value={day.department || ''} onChange={e => handleCompositeChange(idx, 'department', e.target.value)} /></td>
                                                                <td className="p-2 align-top"><textarea className="table-input min-h-[60px]" value={day.main_activity || ''} onChange={e => handleCompositeChange(idx, 'main_activity', e.target.value)} /></td>
                                                                <td className="p-2 align-top"><textarea className="table-input min-h-[60px]" value={day.skills_acquired || ''} onChange={e => handleCompositeChange(idx, 'skills_acquired', e.target.value)} /></td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-slate-50 p-2 text-center border-t border-slate-200">
                                        <button type="button" onClick={() => setCompositeDays([...compositeDays, { date: '' }])} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide py-1">
                                            + Add Another Day
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="field-label block mb-2">{logInterval === 'weekly' ? 'Weekly' : 'Monthly'} Summary / Reflection</label>
                                    <textarea
                                        required
                                        className="w-full form-input-clean border rounded-xl px-4 py-3 min-h-[100px]"
                                        placeholder="Summarize your overall experience, main challenges, and achievements for this period..."
                                        value={compositeSummary}
                                        onChange={e => setCompositeSummary(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50 z-10">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                    <button type="submit" form="log-form" disabled={submitting} className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-95 disabled:opacity-70 disabled:active:scale-100">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Submit Log
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .field-label { @apply text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1; }
                .field-input { @apply w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all; }
                .table-input { @apply w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none; }
            `}</style>
        </div>
    );
}


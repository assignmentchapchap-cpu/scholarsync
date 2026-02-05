'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@schologic/database";
import {
    ArrowLeft, Calendar, MapPin, User,
    BookOpen, Layers, CheckCircle2, Clock,
    FileText, Download, Upload, ChevronRight, AlertCircle,
    List, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import PracticumStats from '@/components/practicum/PracticumStats';
import LogEntryModal from '@/components/practicum/LogEntryModal';
import { Database } from "@schologic/database";
import { LogTemplateType, PracticumTimeline, TimelineEvent, TimelineWeek, PracticumLogEntry } from '@/types/practicum';
import { cn } from '@/lib/utils';

// Import Instructor Viewers for Parity
import { LogsRubricViewer, SupervisorRubricViewer, ReportRubricViewer } from '@/components/instructor/rubrics/RubricViewers';
import {
    LOGS_ASSESSMENT_RUBRIC,
    TEACHING_PRACTICE_OBSERVATION_GUIDE,
    INDUSTRIAL_ATTACHMENT_OBSERVATION_GUIDE,
    PRACTICUM_REPORT_SCORE_SHEET
} from "@schologic/practicum-core";

// Types
type Practicum = Database['public']['Tables']['practicums']['Row'];
type Enrollment = Database['public']['Tables']['practicum_enrollments']['Row'];
type LogEntry = Database['public']['Tables']['practicum_logs']['Row'];
type Resource = Database['public']['Tables']['practicum_resources']['Row'];

export default function StudentPracticumDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const supabase = createClient();

    // -- State --
    const [loading, setLoading] = useState(true);
    const [practicum, setPracticum] = useState<Practicum | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);

    // UI State
    const activeTab = searchParams.get('tab') as 'overview' | 'rubrics' | 'resources' | 'logs' | 'report' || 'overview';
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [showLogs, setShowLogs] = useState(false); // Default hide logs

    // Rubric Sub-tab State
    const [rubricTab, setRubricTab] = useState<'logs' | 'supervisor' | 'report'>('logs');

    // -- Fetch Data --
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Middleware should handle

                // 1. Fetch Enrollment & Practicum
                const { data: enrollData, error: enrollError } = await supabase
                    .from('practicum_enrollments')
                    .select('*, practicums(*)')
                    .eq('student_id', user.id)
                    .eq('practicum_id', id)
                    .single();

                if (enrollError || !enrollData) {
                    router.replace(`/student/practicum/${id}/setup`);
                    return;
                }

                // 2. STATUS CHECK
                if (enrollData.status !== 'approved') {
                    router.replace(`/student/practicum/${id}/setup`);
                    return;
                }

                setEnrollment(enrollData);
                setPracticum(enrollData.practicums as unknown as Practicum);

                // 3. Fetch Logs
                const { data: logData, error: logError } = await supabase
                    .from('practicum_logs')
                    .select('*')
                    .eq('practicum_id', id)
                    .eq('student_id', user.id)
                    .order('log_date', { ascending: false });

                if (logError) throw logError;
                setLogs(logData || []);

                // 4. Fetch Resources
                const { data: resData, error: resError } = await supabase
                    .from('practicum_resources')
                    .select('*')
                    .eq('practicum_id', id);

                if (resError) throw resError;
                setResources(resData || []);

            } catch (error: any) {
                console.error("Dashboard fetch error:", error);
                showToast("Failed to load dashboard data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [id, router]);

    // -- Navigation Helper --
    const setTab = (tab: string) => {
        router.push(`/student/practicum/${id}?tab=${tab}`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><span className="animate-pulse font-bold text-slate-400">Loading Dashboard...</span></div>;
    if (!practicum || !enrollment) return null;

    // Parse Timeline & Data
    const timeline = (practicum.timeline as unknown as PracticumTimeline) || { milestones: [] };
    const supervisor = (enrollment.supervisor_data as any) || {};

    // Prepare Rubrics (Use defaults if DB is empty)
    const logsRubric = (practicum.logs_rubric as any) || LOGS_ASSESSMENT_RUBRIC;
    const supervisorRubric = (practicum.supervisor_report_template as any) ||
        (practicum.log_template === 'industrial_attachment' ? INDUSTRIAL_ATTACHMENT_OBSERVATION_GUIDE : TEACHING_PRACTICE_OBSERVATION_GUIDE);
    const reportRubric = (practicum.student_report_template as any) || PRACTICUM_REPORT_SCORE_SHEET;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header Area */}
                <div className="flex flex-col gap-2">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link href="/student/practicums" className="hover:text-emerald-600 transition-colors">My Practicums</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-slate-800">{practicum.title}</span>
                    </nav>

                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                                    enrollment.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                                )}>
                                    {enrollment.status}
                                </span>
                                <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                                    <User className="w-4 h-4" /> Instructor Name
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-1">{practicum.title}</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <span className="text-emerald-600 font-mono font-bold bg-emerald-50 px-2 rounded">{practicum.cohort_code}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {(enrollment.workplace_data as any)?.company_name || 'No Workplace'}</span>
                            </p>
                        </div>

                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95"
                        >
                            <FileText className="w-5 h-5" />
                            New Log Entry
                        </button>
                    </div>
                </div>

                {/* Main Tabs Navigation (Stats Moved Inside Overview) */}
                <div className="flex flex-col gap-6">
                    <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: Layers },
                            // Timeline removed
                            { id: 'rubrics', label: 'Rubrics', icon: CheckCircle2 },
                            { id: 'resources', label: 'Resources', icon: BookOpen }, // Added Resources
                            { id: 'logs', label: 'My Logs', icon: FileText },
                            { id: 'report', label: 'Final Report', icon: FileText },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "px-5 py-3 rounded-t-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2",
                                    activeTab === tab.id
                                        ? "bg-white text-emerald-600 border-emerald-500 shadow-sm translate-y-[2px]"
                                        : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100/50"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="animate-fade-in min-h-[400px]">

                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* 1. Stats Overview (Moved Here) */}
                                <PracticumStats enrollment={enrollment} practicum={practicum} logs={logs} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Timeline & Activity */}
                                    <div className="lg:col-span-2 space-y-8">

                                        {/* Embedded Timeline (Week-based) */}
                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-emerald-600" /> Timeline & Milestones
                                                </h3>
                                                {(() => {
                                                    const hiddenLogCount = !showLogs && timeline.events ? timeline.events.filter(e => e.type === 'log').length : 0;
                                                    return (
                                                        <button
                                                            onClick={() => setShowLogs(!showLogs)}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border",
                                                                showLogs
                                                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                                            )}
                                                        >
                                                            {showLogs ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                            {showLogs ? 'Hide Logs' : 'Show Logs'}
                                                            {!showLogs && hiddenLogCount > 0 && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{hiddenLogCount}</span>}
                                                        </button>
                                                    );
                                                })()}
                                            </div>

                                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                                                {(() => {
                                                    // Ensure we have correct type
                                                    const events = timeline.events || [];
                                                    const weeks = timeline.weeks || [];

                                                    const getEventsForWeek = (week: TimelineWeek) => {
                                                        const start = new Date(week.start_date);
                                                        const end = new Date(week.end_date);
                                                        end.setHours(23, 59, 59, 999);

                                                        return events.filter(e => {
                                                            const d = new Date(e.date);
                                                            const inRange = d >= start && d <= end;
                                                            if (!showLogs && e.type === 'log') return false;
                                                            return inRange;
                                                        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                                    };

                                                    const getVisibleWeeks = () => {
                                                        if (!weeks || weeks.length === 0) return [];
                                                        return weeks.filter(week => {
                                                            const weekEvents = getEventsForWeek(week);
                                                            return weekEvents.length > 0;
                                                        });
                                                    };

                                                    const getPreWeekEvents = () => {
                                                        if (!weeks || weeks.length === 0) return [];
                                                        const firstStart = new Date(weeks[0].start_date);
                                                        return events.filter(e => {
                                                            const d = new Date(e.date);
                                                            if (!showLogs && e.type === 'log') return false;
                                                            return d < firstStart;
                                                        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                                    };

                                                    const getPostWeekEvents = () => {
                                                        if (!weeks || weeks.length === 0) {
                                                            // Fallback: if no weeks defined, show all events here sorted
                                                            return events.filter(e => !showLogs && e.type === 'log' ? false : true)
                                                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                                        }
                                                        const lastEnd = new Date(weeks[weeks.length - 1].end_date);
                                                        // Ensure absolute end of day
                                                        lastEnd.setHours(23, 59, 59, 999);

                                                        return events.filter(e => {
                                                            const d = new Date(e.date);
                                                            if (!showLogs && e.type === 'log') return false;
                                                            return d > lastEnd;
                                                        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                                    };

                                                    const renderEvent = (event: TimelineEvent) => (
                                                        <div key={event.id || Math.random()} className="group flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn("mt-1.5 w-2 h-2 rounded-full flex-shrink-0",
                                                                    event.type === 'report' ? 'bg-red-500' :
                                                                        event.type === 'log' ? 'bg-blue-500' :
                                                                            event.type === 'meeting' ? 'bg-purple-500' : 'bg-emerald-500'
                                                                )} />
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-800">{event.title}</p>
                                                                    {event.description && <p className="text-xs text-slate-500 line-clamp-1">{event.description}</p>}
                                                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                                        <span className={cn("font-medium", new Date(event.date) < new Date() ? "text-slate-400" : "text-emerald-600")}>
                                                                            {new Date(event.date).toLocaleDateString()}
                                                                        </span>
                                                                        {event.type === 'log' && <span className="bg-blue-50 text-blue-600 px-1.5 rounded text-[10px] font-bold uppercase">Log</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );

                                                    const preEvents = getPreWeekEvents();
                                                    const visibleWeeks = getVisibleWeeks();
                                                    const postEvents = getPostWeekEvents();
                                                    const isEmpty = preEvents.length === 0 && visibleWeeks.length === 0 && postEvents.length === 0;

                                                    return (
                                                        <div className="space-y-6">
                                                            {/* Pre-Week Events */}
                                                            {preEvents.length > 0 && (
                                                                <div className="relative pl-6 border-l-2 border-slate-100 pb-2">
                                                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-100" />
                                                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3 pl-1">Pre-Practicum</h4>
                                                                    <div className="space-y-2">
                                                                        {preEvents.map(renderEvent)}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Weekly Events */}
                                                            {visibleWeeks.map(week => (
                                                                <div key={week.week_number} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-6">
                                                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-100 border-2 border-white ring-1 ring-emerald-50" />

                                                                    <div className="flex items-baseline justify-between mb-3 pl-1">
                                                                        <h4 className="font-bold text-slate-800 text-sm">{week.label}</h4>
                                                                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                                            {new Date(week.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(week.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                        </span>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        {getEventsForWeek(week).map(renderEvent)}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Post-Week Events */}
                                                            {postEvents.length > 0 && (
                                                                <div className="relative pl-6 border-l-2 border-slate-100 pb-2 border-transparent">
                                                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-100" />
                                                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3 pl-1">Post-Practicum</h4>
                                                                    <div className="space-y-2">
                                                                        {postEvents.map(renderEvent)}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {isEmpty && (
                                                                <div className="text-center py-8">
                                                                    <p className="text-slate-400 italic">No events to display.</p>
                                                                    {!showLogs && events.some(e => e.type === 'log') && (
                                                                        <button onClick={() => setShowLogs(true)} className="text-emerald-600 text-sm font-bold hover:underline mt-2">
                                                                            Show hidden log entries
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </section>

                                        {/* Recent Activity */}
                                        <section>
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h3>
                                            <div className="space-y-3">
                                                {logs.slice(0, 3).map((log) => {
                                                    const entries = log.entries as unknown as PracticumLogEntry;
                                                    return (
                                                        <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => setTab('logs')}>
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">Log Entry: {entries?.subject || entries?.main_activity || 'Untitled Log'}</h4>
                                                                    <p className="text-xs text-slate-500">{new Date(log.log_date).toDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <span className={cn("text-xs font-bold px-3 py-1 rounded-full uppercase",
                                                                log.supervisor_status === 'verified' ? "bg-emerald-100 text-emerald-700" :
                                                                    log.supervisor_status === 'rejected' ? "bg-red-100 text-red-700" :
                                                                        "bg-slate-100 text-slate-500"
                                                            )}>{log.supervisor_status}</span>
                                                        </div>
                                                    );
                                                })}
                                                {logs.length === 0 && (
                                                    <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
                                                        <p className="text-slate-400 font-medium">No activity yet.</p>
                                                        <button onClick={() => setIsLogModalOpen(true)} className="text-emerald-600 font-bold text-sm mt-2 hover:underline">Create your first entry</button>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Supervisor & Quick Resources */}
                                    <div className="space-y-8">
                                        {/* Supervisor Card */}
                                        <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5 text-emerald-400" /> Supervisor
                                            </h3>
                                            <div className="space-y-1 mb-6">
                                                <p className="text-2xl font-black text-white">{supervisor.name || 'Not Assigned'}</p>
                                                <p className="font-medium text-emerald-400">{supervisor.designation || 'Supervisor'}</p>
                                                <p className="text-sm opacity-60">{(enrollment.workplace_data as any)?.company_name}</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
                                                <span>Actions:</span>
                                                <button className="text-white font-bold hover:text-emerald-400 transition-colors text-xs uppercase tracking-wide">
                                                    Resend Verify Link
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Resources Link */}
                                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                                            <BookOpen className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                                            <h3 className="font-bold text-emerald-900 mb-1">Downloads</h3>
                                            <p className="text-emerald-700/80 text-sm mb-4">Access templates and guides.</p>
                                            <button
                                                onClick={() => setTab('resources')}
                                                className="w-full py-2 bg-white text-emerald-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                                            >
                                                View All Resources
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: RUBRICS (Strict Parity with Instructor) */}
                        {activeTab === 'rubrics' && (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
                                {/* Sidebar Navigation */}
                                <div className="lg:col-span-1 space-y-2">
                                    <button
                                        onClick={() => setRubricTab('logs')}
                                        className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all",
                                            rubricTab === 'logs' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <List className="w-5 h-5" />
                                        <div className="text-left">
                                            <p>Logs Assessment</p>
                                            <p className={cn("text-xs font-normal opacity-80", rubricTab === 'logs' ? "text-emerald-100" : "text-slate-400")}>Daily/Weekly Entries</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setRubricTab('supervisor')}
                                        className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all",
                                            rubricTab === 'supervisor' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <User className="w-5 h-5" />
                                        <div className="text-left">
                                            <p>Supervisor Report</p>
                                            <p className={cn("text-xs font-normal opacity-80", rubricTab === 'supervisor' ? "text-emerald-100" : "text-slate-400")}>Field Assessment</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setRubricTab('report')}
                                        className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all",
                                            rubricTab === 'report' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <div className="text-left">
                                            <p>Final Report</p>
                                            <p className={cn("text-xs font-normal opacity-80", rubricTab === 'report' ? "text-emerald-100" : "text-slate-400")}>Project/Thesis</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Content Area (Using Viewers) */}
                                <div className="lg:col-span-3">
                                    {rubricTab === 'logs' && <LogsRubricViewer rubric={logsRubric} />}
                                    {rubricTab === 'supervisor' && <SupervisorRubricViewer rubric={supervisorRubric} />}
                                    {rubricTab === 'report' && <ReportRubricViewer rubric={reportRubric} />}
                                </div>
                            </div>
                        )}

                        {/* TAB: RESOURCES (New) */}
                        {activeTab === 'resources' && (
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 min-h-[400px]">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-emerald-500" /> Practicum Resources
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {resources.map((res) => (
                                        <a
                                            key={res.id}
                                            href={res.file_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-slate-50 hover:bg-white"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-emerald-50 transition-colors">
                                                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                                                </div>
                                                <Download className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" />
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors truncate">{res.title}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                                <span className="uppercase">{res.mime_type?.split('/')[1] || 'FILE'}</span>
                                                <span>•</span>
                                                <span>{(res.size_bytes ? (res.size_bytes / 1024 / 1024).toFixed(2) : '0')} MB</span>
                                            </p>
                                        </a>
                                    ))}
                                    {resources.length === 0 && (
                                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">No resources have been uploaded by the instructor yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: LOGS */}
                        {activeTab === 'logs' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Logbook Entries</h2>
                                    {/* Filters Stub */}
                                    <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-600">
                                        <option>All Weeks</option>
                                        <option>Week 1</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    {logs.map((log) => {
                                        const entries = log.entries as unknown as PracticumLogEntry;
                                        return (
                                            <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col md:flex-row gap-6">
                                                {/* Left: Date Box */}
                                                <div className="flex-none flex md:flex-col items-center justify-center bg-slate-50 rounded-xl w-full md:w-24 p-3 border border-slate-100">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">{new Date(log.log_date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-2xl font-black text-slate-800">{new Date(log.log_date).getDate()}</span>
                                                    <span className="text-xs font-medium text-slate-400">{new Date(log.log_date).toLocaleString('default', { weekday: 'short' })}</span>
                                                </div>

                                                {/* Middle: Content */}
                                                <div className="flex-grow space-y-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={cn("w-2 h-2 rounded-full",
                                                            log.supervisor_status === 'verified' ? "bg-emerald-500" :
                                                                log.supervisor_status === 'rejected' ? "bg-red-500" : "bg-slate-300"
                                                        )} />
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{log.supervisor_status}</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">{entries?.subject || entries?.main_activity || 'Log Entry'}</h3>
                                                    <p className="text-slate-600 line-clamp-2 text-sm">
                                                        {entries?.notes || entries?.reflection || "No details provided."}
                                                    </p>
                                                    <div className="flex gap-4 text-xs font-medium text-slate-400 pt-2">
                                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {log.clock_in ? new Date(log.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} - {log.clock_out ? new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex-none flex items-center">
                                                    <button className="text-slate-400 hover:text-emerald-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {logs.length === 0 && (
                                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">No logs yet</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start documenting your daily activities to stay on track with your practicum.</p>
                                            <button onClick={() => setIsLogModalOpen(true)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                                                Create First Entry
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: REPORT */}
                        {activeTab === 'report' && (
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Upload className="w-10 h-10 text-slate-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Final Practicum Report</h2>
                                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                                    Upload your final comprehensive report here. This contributes 30% to your final grade.
                                    Ensure you follow the template provided in the Resources tab.
                                </p>

                                <div className="max-w-xl mx-auto border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-emerald-400 hover:bg-emerald-50/10 transition-all cursor-pointer group">
                                    <p className="font-bold text-slate-700 group-hover:text-emerald-700">Drag and drop your report (PDF) here</p>
                                    <p className="text-sm text-slate-400 mt-2">Max file size: 10MB</p>
                                    <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors">
                                        Browse Files
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modals */}
            <LogEntryModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                practicumId={id}
                templateType={practicum.log_template as LogTemplateType}
            />
        </div>
    );
}

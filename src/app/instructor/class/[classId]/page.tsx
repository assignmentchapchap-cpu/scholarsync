'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase';
import { FileText, Download, Lock, Unlock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClassDetailsParams({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = use(params);
    return <ClassDetails classId={classId} />
}

function ClassDetails({ classId }: { classId: string }) {
    const [classData, setClassData] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchData();

        // Enable Realtime
        const channel = supabase
            .channel('realtime submissions')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'submissions', filter: `class_id=eq.${classId}` },
                (payload) => {
                    setSubmissions((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [classId]);

    const fetchData = async () => {
        try {
            const [clsRes, subRes] = await Promise.all([
                supabase.from('classes').select('*').eq('id', classId).single(),
                supabase.from('submissions').select('*, profiles(full_name)').eq('class_id', classId).order('created_at', { ascending: false })
            ]);

            if (clsRes.data) setClassData(clsRes.data);
            if (subRes.data) setSubmissions(subRes.data);

        } catch (error) {
            console.error("Error loading class data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLock = async () => {
        if (!classData) return;
        const newVal = !classData.is_locked;
        const { error } = await supabase.from('classes').update({ is_locked: newVal }).eq('id', classId);
        if (!error) {
            setClassData({ ...classData, is_locked: newVal });
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <Link href="/instructor/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <header className="flex justify-between items-end mb-8 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{classData?.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded">
                                {classData?.invite_code}
                            </span>
                            <span className="text-sm text-slate-400">Share this code with students</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={toggleLock}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${classData?.is_locked ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                        >
                            {classData?.is_locked ? <><Lock className="w-4 h-4" /> Locked</> : <><Unlock className="w-4 h-4" /> Open</>}
                        </button>
                        {/* Placeholder for bulk export */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Student</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold text-center">AI Score</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">
                                        No submissions yet. Waiting for students...
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">
                                            {/* Ideally we join profiles, but for MVP we might need to fetch or use what we select */}
                                            {/* Since we selected '*, profiles(full_name)', Supabase returns profiles object if relation correct */}
                                            {/* NOTE: Supabase JS sometimes returns array if one-to-many, object if one-to-one. Assuming one-to-one here. */}
                                            {sub.profiles?.full_name || 'Unknown Student'}
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${sub.ai_score > 70 ? 'bg-red-100 text-red-700' :
                                                    sub.ai_score > 30 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {sub.ai_score.toFixed(1)}% AI
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/instructor/submission/${sub.id}`}
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FileText className="w-4 h-4" /> View Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

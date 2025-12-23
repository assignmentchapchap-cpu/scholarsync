'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Users, Lock, Unlock, Copy, Home, Terminal, Settings, X, Save, CheckCircle, Zap, AlignLeft, Brain } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MODELS, MODEL_LABELS, ScoringMethod, Granularity } from "@/lib/ai-config";

export default function InstructorDashboard() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newClassName, setNewClassName] = useState('');

    // Settings Modal State
    const [editingClass, setEditingClass] = useState<any | null>(null);
    const [settingsForm, setSettingsForm] = useState({
        model: MODELS.ROBERTA_LARGE,
        granularity: Granularity.PARAGRAPH,
        scoring_method: ScoringMethod.WEIGHTED
    });
    const [savingSettings, setSavingSettings] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?role=instructor');
                return;
            }

            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .eq('instructor_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error(error);
            if (data) setClasses(data);
        } catch (error) {
            console.error("Error fetching classes", error);
        } finally {
            setLoading(false);
        }
    };

    const createClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClassName) return;
        setCreating(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Generate a random 6-character code
            const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { data, error } = await supabase
                .from('classes')
                .insert([
                    {
                        instructor_id: user.id,
                        name: newClassName,
                        invite_code: inviteCode
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            setClasses([data, ...classes]);
            setNewClassName('');
        } catch (error) {
            console.error("Error creating class", error);
            alert("Failed to create class. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Code ${code} copied!`);
    }

    const openSettings = (cls: any) => {
        setEditingClass(cls);
        // Load existing settings or defaults
        setSettingsForm({
            model: cls.settings?.model || MODELS.ROBERTA_LARGE,
            granularity: cls.settings?.granularity || Granularity.PARAGRAPH,
            scoring_method: cls.settings?.scoring_method || ScoringMethod.WEIGHTED
        });
    };

    const saveSettings = async () => {
        if (!editingClass) return;
        setSavingSettings(true);
        try {
            const { error } = await supabase
                .from('classes')
                .update({ settings: settingsForm })
                .eq('id', editingClass.id);

            if (error) throw error;

            // Update local state
            setClasses(classes.map(c => c.id === editingClass.id ? { ...c, settings: settingsForm } : c));
            setEditingClass(null);
        } catch (err) {
            console.error("Error saving settings", err);
            alert("Failed to save settings");
        } finally {
            setSavingSettings(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-500">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 animate-fade-in">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href="/" className="p-3 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md">
                            <Home className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Classes</h1>
                            <p className="text-slate-500 font-medium">Manage your classrooms</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* New Lab Link */}
                        <Link
                            href="/instructor/lab"
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all font-bold text-sm uppercase tracking-wide"
                        >
                            <Terminal className="w-4 h-4" />
                            AI Lab
                        </Link>

                        {/* Create Class Form */}
                        <form onSubmit={createClass} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New Class Name"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                className="p-3 border border-slate-200 rounded-xl shadow-sm w-48 md:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                                required
                            />
                            <button
                                disabled={creating}
                                className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-70 text-sm uppercase tracking-wide"
                            >
                                <Plus className="w-4 h-4" />
                                {creating ? '...' : 'Create'}
                            </button>
                        </form>
                    </div>
                </header>

                {classes.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 animate-slide-in">
                        <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No classes yet</h3>
                        <p className="text-slate-400 mt-2 font-medium">Create your first class above to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
                        {classes.map((cls) => (
                            <div key={cls.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 truncate pr-4 group-hover:text-indigo-600 transition-colors" title={cls.name}>
                                        {cls.name}
                                    </h3>
                                    <Link href={`/instructor/class/${cls.id}`} className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                                        <Unlock className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Invite Code</span>
                                        <div className="text-2xl font-mono font-bold text-slate-700 tracking-wider">
                                            {cls.invite_code}
                                        </div>
                                    </div>
                                    <button onClick={() => copyCode(cls.invite_code)} className="text-slate-400 hover:text-indigo-600 transition-colors active:scale-90" title="Copy Code">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                        {cls.is_locked ? (
                                            <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                                                <Lock className="w-3 h-3" /> Locked
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                <Unlock className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => openSettings(cls)}
                                        className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg group-hover:bg-white"
                                        title="Class AI Settings"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Active Settings Badges */}
                                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> Logic
                                        </span>
                                        <span className="text-xs font-bold text-slate-700 capitalize">
                                            {cls.settings?.scoring_method || 'Weighted'}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <AlignLeft className="w-3 h-3" /> Unit
                                        </span>
                                        <span className="text-xs font-bold text-slate-700 capitalize">
                                            {cls.settings?.granularity || 'Paragraph'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            {editingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingClass(null)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-slide-in-from-bottom">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-indigo-600" />
                                AI Configuration
                            </h3>
                            <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">AI Detection Model</label>
                                {Object.entries(MODELS).map(([key, value]) => (
                                    <label key={key} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${settingsForm.model === value
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${settingsForm.model === value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <Brain className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={`block text-sm font-bold ${settingsForm.model === value ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {MODEL_LABELS[value] || key}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">{value.split('/').pop()}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="model"
                                            value={value}
                                            checked={settingsForm.model === value}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, model: e.target.value })}
                                            className="sr-only"
                                        />
                                        {settingsForm.model === value && <CheckCircle className="w-5 h-5 text-indigo-600 fill-indigo-100" />}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Granularity</label>
                                <div className="flex flex-col gap-2">
                                    {[Granularity.PARAGRAPH, Granularity.SENTENCE].map((g) => (
                                        <label key={g} className={`relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-sm font-bold capitalize ${settingsForm.granularity === g
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="granularity"
                                                value={g}
                                                checked={settingsForm.granularity === g}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, granularity: e.target.value as Granularity })}
                                                className="sr-only"
                                            />
                                            {g}
                                            {settingsForm.granularity === g && <CheckCircle className="w-3 h-3 absolute top-2 right-2 text-emerald-400" />}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Strictness</label>
                                <div className="flex flex-col gap-2">
                                    {Object.values(ScoringMethod).map((m) => (
                                        <label key={m} className={`relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-sm font-bold capitalize ${settingsForm.scoring_method === m
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="scoring"
                                                value={m}
                                                checked={settingsForm.scoring_method === m}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, scoring_method: e.target.value as ScoringMethod })}
                                                className="sr-only"
                                            />
                                            {m}
                                            {settingsForm.scoring_method === m && <CheckCircle className="w-3 h-3 absolute top-2 right-2 text-indigo-200" />}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={() => setEditingClass(null)}
                            className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={savingSettings}
                            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            {savingSettings ? 'Saving...' : (
                                <>
                                    <Save className="w-4 h-4" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

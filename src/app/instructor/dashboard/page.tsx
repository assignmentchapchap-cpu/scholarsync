'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Users, Lock, Unlock, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InstructorDashboard() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newClassName, setNewClassName] = useState('');
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

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">My Classes</h1>
                        <p className="text-slate-500">Manage your classrooms and assignments</p>
                    </div>

                    {/* Create Class Form */}
                    <form onSubmit={createClass} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Class Name (e.g. ENG 101)"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            className="p-3 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <button
                            disabled={creating}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
                        >
                            <Plus className="w-5 h-5" />
                            {creating ? 'Creating...' : 'Create Class'}
                        </button>
                    </form>
                </header>

                {classes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-medium text-slate-600">No classes yet</h3>
                        <p className="text-slate-400 mt-2">Create your first class above to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-800 truncate" title={cls.name}>
                                        {cls.name}
                                    </h3>
                                    <Link href={`/instructor/class/${cls.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                                        Open &rarr;
                                    </Link>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Invite Code</span>
                                        <div className="text-2xl font-mono font-bold text-slate-700 tracking-wider">
                                            {cls.invite_code}
                                        </div>
                                    </div>
                                    <button onClick={() => copyCode(cls.invite_code)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Copy Code">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    {cls.is_locked ? (
                                        <span className="flex items-center gap-1 text-red-500">
                                            <Lock className="w-4 h-4" /> Locked
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <Unlock className="w-4 h-4" /> Submissions Open
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

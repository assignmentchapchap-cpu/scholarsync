'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@schologic/database";
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { verifyUnifiedInvite, enrollStudent, enrollStudentInPracticum } from '@/app/actions/student';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Alert from '@/components/Alert';

export default function StudentLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('view') === 'signup' ? 'signup' : 'login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [regError, setRegError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const supabase = createClient();
    const { showToast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signup') {
                // --- SIGN UP FLOW ---

                // 1. Verify Invite Code via Server Action (Bypasses RLS)
                const verifyRes = await verifyUnifiedInvite(inviteCode);

                if (verifyRes.error) throw new Error(verifyRes.error);
                if (!verifyRes.success || !verifyRes.id) throw new Error("Invalid invite code");

                // 2. Create Auth User

                // Capitalize Name
                const formattedName = studentName
                    .split(' ')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join(' ');

                const { data: authData, error: authErr } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?next=/student/dashboard`,
                        data: {
                            role: 'student',
                            full_name: formattedName,
                            registration_number: regNumber, // Pass here for trigger to handle
                        }
                    }
                });

                if (authErr) {
                    if (authErr.message.includes('already registered') || authErr.code === 'unique_violation') {
                        throw new Error("This email is already registered. Please log in.");
                    }
                    throw authErr;
                }
                if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
                    throw new Error("This email is already registered. Please log in.");
                }
                if (!authData.user) throw new Error("Signup failed");

                // 3. Upsert Profile - Client side update might fail if no session (email confirm enabled).
                if (authData.session) {
                    await supabase.from('profiles').update({
                        full_name: formattedName,
                        registration_number: regNumber,
                        role: 'student'
                    }).eq('id', authData.user.id);
                }

                // 4. Create Enrollment via Server Action
                let enrollRes;
                if (verifyRes.type === 'class') {
                    enrollRes = await enrollStudent(authData.user.id, verifyRes.id, formattedName, regNumber);
                } else {
                    enrollRes = await enrollStudentInPracticum(authData.user.id, verifyRes.id, formattedName, regNumber);
                }

                if (enrollRes.error && enrollRes.error !== 'Already enrolled') {
                    console.error("Enrollment Error:", enrollRes.error);
                }

                showToast("Account created! Please verify your email.", 'success');

                if (authData.session) {
                    if (verifyRes.type === 'practicum') {
                        router.push(`/student/practicum/${verifyRes.id}/setup`);
                    } else {
                        router.push('/student/dashboard');
                    }
                } else {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('view');
                    router.push(`?${params.toString()}`);
                }

            } else {
                // --- LOGIN FLOW ---
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                router.push('/student/dashboard');
            }

        } catch (error: unknown) {
            console.error("Auth Error", error);
            const message = error instanceof Error ? error.message : 'Authentication failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 text-center tracking-tight">
                {mode === 'signup' ? 'Join Portal' : 'Student Login'}
            </h2>

            {error && <Alert type="error" message={error} />}

            <form onSubmit={handleAuth} className="space-y-4">

                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@school.edu"
                    required
                    fullWidth
                    className="bg-slate-50"
                />

                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={6}
                    fullWidth
                    className="bg-slate-50"
                />

                {/* Signup Only Fields */}
                {mode === 'signup' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider"><span className="bg-white px-2 text-slate-400">Enrollment Details</span></div>
                        </div>

                        <Input
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value)}
                            className="bg-slate-50 font-mono text-center text-xl tracking-widest uppercase focus:ring-emerald-500"
                            placeholder="INVITE CODE"
                            required
                            maxLength={20}
                            fullWidth
                        />

                        <Input
                            value={studentName}
                            onChange={e => {
                                const val = e.target.value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                                setStudentName(val);
                            }}
                            placeholder="Full Name"
                            required
                            fullWidth
                            className="bg-slate-50"
                        />

                        <Input
                            value={regNumber}
                            onChange={e => {
                                const val = e.target.value.toUpperCase();
                                if (val.length <= 12 && /^[A-Z0-9\-#/]*$/.test(val)) {
                                    setRegNumber(val);
                                    setRegError(null);
                                } else if (val.length <= 12) {
                                    setRegError('Invalid characters');
                                }
                            }}
                            className={`font-mono bg-slate-50 ${regError ? 'border-red-300 bg-red-50' : 'focus:ring-emerald-500'}`}
                            placeholder="Reg No (A001/2023)"
                            required
                            error={regError || undefined}
                            fullWidth
                        />
                    </div>
                )}

                <Button
                    type="submit"
                    isLoading={loading}
                    fullWidth
                    size="lg"
                    variant="success"
                    className="active:scale-95 shadow-lg shadow-emerald-100"
                >
                    {mode === 'signup' ? 'Join Portal' : 'Log In'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (mode === 'signup') {
                            params.delete('view'); // Default to login
                        } else {
                            params.set('view', 'signup');
                        }
                        router.push(`?${params.toString()}`);
                        setError(null);
                    }}
                    className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    {mode === 'signup' ? 'Already have an account? Log In' : 'Need to join a class? Sign Up'}
                </button>
            </div>
        </div>
    );
}

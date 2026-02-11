'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@schologic/database";
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { verifyUnifiedInvite, enrollStudent, enrollStudentInPracticum } from '@/app/actions/student';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { OTPInput } from '@/components/ui/OTPInput';
import Alert from '@/components/Alert';

type AuthStage = 'credentials' | 'otp_signup' | 'otp_reset' | 'new_password';

// Password Validation Helper
// Password Validation Helper
const isPasswordStrong = (pwd: string) => {
    const hasMinLength = pwd.length >= 6;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    // Special char validation removed per user request
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

export default function StudentLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const mode = searchParams.get('view') === 'signup' ? 'signup' : 'login';
    const isReset = searchParams.get('view') === 'reset';

    // Local State
    const [authStage, setAuthStage] = useState<AuthStage>('credentials');

    // Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Field Errors
    const [regError, setRegError] = useState<string | null>(null);

    // Status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const supabase = createClient();
    const { showToast } = useToast();

    // 1. Initial Submission (Credentials)
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            if (isReset) {
                // Password Reset -> Send OTP
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                setAuthStage('otp_reset');
                setSuccessMsg(`We sent a 6-digit code to ${email}.`);
            }
            else if (mode === 'signup') {
                // --- SIGN UP FLOW ---
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!isPasswordStrong(password)) {
                    throw new Error("Password must be at least 6 characters and include uppercase, lowercase, and number.");
                }

                // 1. Verify Invite Code (Server Action)
                const verifyRes = await verifyUnifiedInvite(inviteCode);
                if (verifyRes.error) throw new Error(verifyRes.error);
                if (!verifyRes.success || !verifyRes.id) throw new Error("Invalid invite code");

                // 2. Suppress Standard Login, Trigger OTP Signup
                const formattedName = studentName
                    .split(' ')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join(' ');

                const { data, error: authErr } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: 'student',
                            full_name: formattedName,
                            registration_number: regNumber,
                        }
                    }
                });

                if (authErr) {
                    if (authErr.message.includes('already registered') || authErr.code === 'unique_violation') {
                        throw new Error("This email is already registered. Please log in.");
                    }
                    throw authErr;
                }

                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    throw new Error('This email is already registered. Please sign in.');
                }

                setAuthStage('otp_signup');
                setSuccessMsg(`Account created! Enter the code sent to ${email}.`);
            }
            else {
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

    // 2. OTP Verification
    const [resendTimer, setResendTimer] = useState(0);

    // Timer effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError(null);
        try {
            if (isReset) {
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                });
                if (error) throw error;
            }

            showToast(`Code resent to ${email}`, 'success');
            setResendTimer(60); // 60s cooldown
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const type = authStage === 'otp_signup' ? 'signup' : 'recovery';

            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type
            });

            if (verifyError) throw verifyError;

            if (authStage === 'otp_signup') {
                // Signup Complete -> Finalize Enrollment
                await handlePostSignupEnrollment(data.user?.id);
            } else {
                // Reset OK -> New Password
                setAuthStage('new_password');
                setOtp('');
            }

        } catch (err: unknown) {
            console.error("OTP Error", err);
            setError(err instanceof Error ? err.message : 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    // Helper: Enrollment Logic (Moved after OTP)
    const handlePostSignupEnrollment = async (userId?: string) => {
        if (!userId) throw new Error("User ID missing after verification");

        // Re-verify invite code to get details (or rely on cached state if safe)
        // Ideally we pass this info through, but for safety lets re-verify or trust the state variables
        const verifyRes = await verifyUnifiedInvite(inviteCode);
        if (!verifyRes.success || !verifyRes.id) throw new Error("Invite code invalid during finalization");

        const formattedName = studentName
            .split(' ')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');

        // Upsert Profile
        await supabase.from('profiles').update({
            full_name: formattedName,
            registration_number: regNumber,
            role: 'student'
        }).eq('id', userId);

        // Enroll
        let enrollRes;
        if (verifyRes.type === 'class') {
            enrollRes = await enrollStudent(userId, verifyRes.id, formattedName, regNumber);
        } else {
            enrollRes = await enrollStudentInPracticum(userId, verifyRes.id, formattedName, regNumber);
        }

        if (enrollRes.error && enrollRes.error !== 'Already enrolled') {
            console.error("Enrollment Error:", enrollRes.error);
            // We don't block login if enrollment fails, but user should know
            showToast("Enrollment issue: " + enrollRes.error, 'error');
        } else {
            showToast("Account created & Enrolled!", 'success');
        }

        if (verifyRes.type === 'practicum') {
            router.push(`/student/practicum/${verifyRes.id}/setup`);
        } else {
            router.push('/student/dashboard');
        }
    };

    // 3. New Password
    const handleNewPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!isPasswordStrong(newPassword)) {
            setError("Password must be at least 6 characters and include uppercase, lowercase, and number.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            router.push('/student/dashboard');
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    // --- Renders ---

    const renderCredentials = () => (
        <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@school.edu"
                required
                fullWidth
                className="bg-slate-50"
                disabled={loading}
            />

            {!isReset && (
                <div className="space-y-4">
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        showStrength={mode === 'signup'}
                    />
                    {mode === 'signup' && (
                        <PasswordInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                </div>
            )}

            {/* Signup Extras */}
            {mode === 'signup' && !isReset && (
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
                {isReset ? 'Send Reset Code' : (mode === 'signup' ? 'Join Portal' : 'Log In')}
            </Button>
        </form>
    );

    const renderOTPForm = () => (
        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center">
                <p className="text-slate-500 mb-4">
                    Enter the 6-digit code sent to <span className="font-bold text-slate-800">{email}</span>
                </p>
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                />
            </div>

            <Button
                type="submit"
                isLoading={loading}
                fullWidth
                size="lg"
                variant="success"
                disabled={otp.length !== 6}
            >
                Verify Code
            </Button>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-emerald-600 hover:text-emerald-800 disabled:text-slate-400 font-medium"
                >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                </button>
                <button
                    type="button"
                    onClick={() => setAuthStage('credentials')}
                    className="w-full text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-3 h-3" /> Wrong Email?
                </button>
            </div>
        </form>
    );

    const renderNewPasswordForm = () => (
        <form onSubmit={handleNewPasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                showStrength
            />
            <PasswordInput
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
            />
            <Button
                type="submit"
                isLoading={loading}
                fullWidth
                size="lg"
                variant="success"
            >
                Set New Password
            </Button>
        </form>
    );

    const switchView = (newParams: URLSearchParams) => {
        setAuthStage('credentials');
        setError(null);
        setSuccessMsg(null);
        setOtp('');
        router.push(`?${newParams.toString()}`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 text-center tracking-tight">
                {isReset ? 'Reset Password' : (mode === 'signup' ? 'Join Portal' : 'Student Login')}
            </h2>

            {error && <Alert type="error" message={error} />}
            {successMsg && <Alert type="success" message={successMsg} />}

            {authStage === 'credentials' && renderCredentials()}
            {(authStage === 'otp_signup' || authStage === 'otp_reset') && renderOTPForm()}
            {authStage === 'new_password' && renderNewPasswordForm()}

            {authStage === 'credentials' && (
                <div className="mt-6 text-center space-y-2">
                    {!isReset ? (
                        <>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (mode === 'signup') params.delete('view');
                                    else params.set('view', 'signup');
                                    switchView(params);
                                }}
                                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors block w-full"
                            >
                                {mode === 'signup' ? 'Already have an account? Log In' : 'Need to join a class? Sign Up'}
                            </button>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('view', 'reset');
                                    switchView(params);
                                }}
                                className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                                type="button"
                            >
                                Forgot Password?
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('view');
                                switchView(params);
                            }}
                            className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                            Back to Login
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@schologic/database";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { OTPInput } from '@/components/ui/OTPInput';
import Alert from '@/components/Alert';
import DemoSignupModal from '@/components/auth/DemoSignupModal';

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

export default function InstructorLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const isSignUp = searchParams.get('view') === 'signup';
    const isReset = searchParams.get('view') === 'reset';

    // Local State
    const [authStage, setAuthStage] = useState<AuthStage>('credentials');
    const [showDemoModal, setShowDemoModal] = useState(false);

    // Form Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Status State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const supabase = createClient();

    // Helper to Reset State when switching views
    const switchView = (newParams: URLSearchParams) => {
        setAuthStage('credentials');
        setError(null);
        setSuccessMsg(null);
        setOtp('');
        router.push(`?${newParams.toString()}`);
    };

    // 1. Initial Submission (Credentials)
    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isReset) {
                // Password Reset -> Send OTP
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                setAuthStage('otp_reset');
                setSuccessMsg(`We sent a 6-digit code to ${email}.`);
            } else if (isSignUp) {
                // Sign Up -> Send OTP (via signUp)
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!isPasswordStrong(password)) {
                    throw new Error("Password must be at least 6 characters and include uppercase, lowercase, and number.");
                }

                const capFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                const capLast = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: capFirst,
                            last_name: capLast,
                            full_name: `${capFirst} ${capLast}`.trim(),
                            role: 'instructor'
                        }
                    }
                });

                if (error) throw error;

                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    throw new Error('This email is already registered. Please sign in or reset your password.');
                }

                setAuthStage('otp_signup');
                setSuccessMsg(`We sent a 6-digit code to ${email}.`);
            } else {
                // Sign In (Direct)
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                if (data.user && !data.user.email_confirmed_at) {
                    // Start OTP verification for unverified users
                    setAuthStage('otp_signup');
                    setSuccessMsg("Please verify your email to continue.");
                    await supabase.auth.signOut(); // Clean slate
                    return;
                }

                router.push('/instructor/dashboard');
                router.refresh();
            }
        } catch (err: unknown) {
            console.error('Auth error:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed.');
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
            // Resend logic depends on flow. 
            // For signup, we can call signUp again (it resends if user exists and unverified) or resendOtp
            // For recovery, resendPasswordForEmail

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

            setSuccessMsg(`Code resent to ${email}`);
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

            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: type
            });

            if (verifyError) throw verifyError;

            if (authStage === 'otp_signup') {
                // Signup Complete -> Dashboard
                router.push('/instructor/dashboard');
                router.refresh();
            } else {
                // Reset OTP Verified -> Set New Password
                setAuthStage('new_password');
                setOtp(''); // Clear OTP
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Set New Password (Reset Flow)
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

            router.push('/instructor/dashboard');
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    // --- Render Helpers ---

    const renderCredentialsForm = () => (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {isSignUp && !isReset && (
                <div className="flex gap-4">
                    <Input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isSignUp}
                        className="bg-slate-50"
                        fullWidth
                    />
                    <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isSignUp}
                        className="bg-slate-50"
                        fullWidth
                    />
                </div>
            )}

            <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50"
                fullWidth
                disabled={loading}
            />

            {!isReset && (
                <div className="space-y-4">
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!isReset}
                        showStrength={isSignUp}
                    />
                    {isSignUp && (
                        <PasswordInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                </div>
            )}

            <Button
                type="submit"
                isLoading={loading}
                fullWidth
                size="lg"
                variant="primary"
            >
                {isReset ? 'Send Reset Code' : (isSignUp ? 'Create Account' : 'Sign In')}
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
                variant="primary"
                disabled={otp.length !== 6}
            >
                Verify Code
            </Button>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 font-medium"
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
                variant="primary"
            >
                Set New Password
            </Button>
        </form>
    );


    // --- Main Render ---

    const getTitle = () => {
        if (authStage === 'new_password') return 'Set New Password';
        if (authStage.startsWith('otp')) return 'Check Your Email';
        if (isReset) return 'Reset Password';
        if (isSignUp) return 'Create Instructor Account';
        return 'Instructor Login';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 text-center tracking-tight">
                {getTitle()}
            </h2>

            {showDemoModal && <DemoSignupModal onClose={() => setShowDemoModal(false)} />}
            {error && <Alert type="error" message={error} />}
            {successMsg && <Alert type="success" message={successMsg} />}

            {authStage === 'credentials' && renderCredentialsForm()}
            {(authStage === 'otp_signup' || authStage === 'otp_reset') && renderOTPForm()}
            {authStage === 'new_password' && renderNewPasswordForm()}

            {authStage === 'credentials' && (
                <div className="flex flex-col gap-3 text-center text-sm text-slate-600 border-t border-slate-100 pt-6 mt-6">
                    {!isReset ? (
                        <>
                            <div>
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (isSignUp) params.delete('view');
                                        else params.set('view', 'signup');
                                        switchView(params);
                                    }}
                                    className="text-indigo-600 font-bold hover:underline"
                                    type="button"
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('view', 'reset');
                                    switchView(params);
                                }}
                                className="text-slate-400 hover:text-slate-600 font-medium transition-colors"
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
                            className="text-indigo-600 font-bold hover:underline"
                            type="button"
                        >
                            Back to Sign In
                        </button>
                    )}
                </div>
            )}

            {!isReset && authStage === 'credentials' && (
                <>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                            <span className="bg-white px-2 text-slate-400">Or Preview</span>
                        </div>
                    </div>

                    <Button
                        onClick={() => setShowDemoModal(true)}
                        disabled={loading}
                        fullWidth
                        variant="outline"
                        className="border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Try Demo Environment
                    </Button>
                </>
            )}
        </div>
    );
}

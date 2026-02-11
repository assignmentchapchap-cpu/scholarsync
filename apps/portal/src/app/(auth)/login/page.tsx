'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Loader2, Home } from 'lucide-react';
import UnifiedAuthTabs from '@/components/auth/UnifiedAuthTabs';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-grid-pattern relative">
            <Link href="/" className="absolute left-6 top-6 p-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all border border-slate-200">
                    <Home className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-slate-500 group-hover:text-indigo-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Back to Home</span>
            </Link>

            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            }>
                <UnifiedAuthTabs />
            </Suspense>
        </div>
    );
}

'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { BackgroundGrid } from '@/components/how-it-works/BackgroundGrid';

export default function HowItWorksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30 text-slate-900 font-sans">
            <Navbar solid={true} />

            <main className="relative pt-20 min-h-screen relative">
                <BackgroundGrid />
                <div className="relative z-10">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

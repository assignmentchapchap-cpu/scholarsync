'use client';

import { GraduationCap, Grid, FileText, Shield, Sparkles, BookOpen, Archive, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavbarProps {
    onOpenDemo?: () => void;
    solid?: boolean;
}

const FEATURES_MENU = [
    { href: '/features/class-manager', label: 'Class Manager', icon: Grid, description: 'Central hub for teaching' },
    { href: '/features/practicum-manager', label: 'Practicum Manager', icon: FileText, description: 'Field placement tracking' },
    { href: '/features/ai-detection', label: 'AI Detection', icon: Shield, description: 'Academic integrity tools' },
    { href: '/features/ai-teaching-assistant', label: 'AI Teaching Assistant', icon: Sparkles, description: 'Automated grading' },
    { href: '/features/universal-reader', label: 'Universal Reader', icon: BookOpen, description: 'Read any document' },
    { href: '/features/oer-library', label: 'OER Library', icon: Archive, description: 'Free textbooks' },
];

export default function Navbar({ onOpenDemo, solid = false }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || solid ? 'bg-slate-900 border-b border-slate-700 py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-serif font-bold text-xl text-white tracking-tight">Schologic LMS</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300 font-sans">
                    {/* Features Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setFeaturesOpen(true)}
                        onMouseLeave={() => setFeaturesOpen(false)}
                    >
                        <button className="flex items-center gap-1 hover:text-white transition-colors">
                            Features
                            <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {featuresOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-2">
                                    <Link
                                        href="/features"
                                        className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors border-b border-slate-800 mb-2"
                                    >
                                        <div className="font-bold text-white">All Features</div>
                                        <div className="text-xs text-slate-400">Complete overview</div>
                                    </Link>

                                    {FEATURES_MENU.map((feature) => (
                                        <Link
                                            key={feature.href}
                                            href={feature.href}
                                            className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                                                <feature.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white text-sm">{feature.label}</div>
                                                <div className="text-xs text-slate-400">{feature.description}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold text-white hover:text-indigo-300 transition-colors hidden md:block">
                        Instructor Login
                    </Link>
                    <Link href="/student/login" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors hidden md:block">
                        Student Login
                    </Link>
                    <button
                        onClick={onOpenDemo}
                        className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                    >
                        Start Demo
                    </button>
                </div>
            </div>
        </nav>
    );
}



import { FeatureHero } from '@/components/features/FeatureHero';
import { CheckCircle, Users, Library, BarChart3, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Class Manager | Schologic LMS',
    description: 'The command center for your teaching workflow. Manage students, assignments, and grades in a single, intuitive dashboard.',
    openGraph: {
        title: 'Class Manager | Schologic LMS',
        description: 'The command center for your teaching workflow. Manage students, assignments, and grades in a single, intuitive dashboard.',
    }
};

const FEATURES = [
    {
        title: "Instant Class Creation",
        description: "Set up a new class in seconds. Invite students via email or a secure join link. No complex configuration required.",
        icon: Users
    },
    {
        title: "Unified Resource Library",
        description: "Upload lecture notes, slides, and readings once. Share them across multiple classes or keep them private for future use.",
        icon: Library
    },
    {
        title: "Real-Time Tracking",
        description: "Monitor student engagement and submission status in real-time. Identify at-risk students before they fall behind.",
        icon: BarChart3
    },
    {
        title: "Streamlined Grading",
        description: "Access submissions, AI reports, and rubrics in a single view. Move from submission to submission without page reloads.",
        icon: CheckCircle
    },
    {
        title: "Deadlines & Extensions",
        description: "Manage due dates with drag-and-drop simplicity. Grant individual extensions with a single click.",
        icon: Clock
    },
    {
        title: "OER Integration",
        description: "Directly link Open Educational Resources (OER) to your syllabus. Lower costs for students without sacrificing quality.",
        icon: Share2
    }
];

export default function ClassManagerPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-24">
            <FeatureHero
                title="Your Complete Teaching Command Center"
                description="The Class Manager is the heart of Schologic LMS. It brings your students, content, and grading into a single, intuitive dashboard designed to save you hours every week."
                label="Cornerstone Feature"
                align="center"
                // Placeholder for actual dashboard visual - using a code block style div for now
                visual={
                    <div className="w-full aspect-[16/9] bg-slate-900 flex items-center justify-center relative group">
                        <div className="text-slate-500 font-mono text-sm">Dashboard Preview Visualization</div>
                        {/* Mock UI elements to verify layout w/o image asset */}
                        <div className="absolute top-12 left-12 right-12 bottom-12 border border-slate-700 rounded-xl bg-slate-950/50 flex flex-col p-6 gap-4">
                            <div className="h-8 w-1/3 bg-slate-800 rounded-lg animate-pulse"></div>
                            <div className="flex gap-4">
                                <div className="h-32 w-1/4 bg-slate-800 rounded-lg animate-pulse delay-75"></div>
                                <div className="h-32 w-1/4 bg-slate-800 rounded-lg animate-pulse delay-150"></div>
                                <div className="h-32 w-1/4 bg-slate-800 rounded-lg animate-pulse delay-200"></div>
                                <div className="h-32 w-1/4 bg-slate-800 rounded-lg animate-pulse delay-300"></div>
                            </div>
                            <div className="h-full bg-slate-800/50 rounded-lg border border-slate-700 border-dashed flex items-center justify-center text-slate-600">
                                Active Class Stream
                            </div>
                        </div>
                    </div>
                }
            />

            <div className="container mx-auto px-6">

                {/* Intro Stat */}
                <div className="max-w-3xl mx-auto text-center mb-24">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Built for the Modern Instructor</h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Traditional LMS interfaces are cluttered and confusing. Schologic's Class Manager strips away the noise, focusing on the three things that matter most: <span className="text-white font-bold">Content, Engagement, and Assessment.</span>
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {FEATURES.map((feature, idx) => (
                        <div key={idx} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Workflow Section */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-20" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                                Efficiency First
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Spend Less Time Administering, More Time Teaching</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block">Batch Actions</strong>
                                        <span className="text-slate-400">Grade multiple submissions or update deadlines for entire groups in one go.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block">Smart Notifications</strong>
                                        <span className="text-slate-400">Automated nudges for impending deadlines and graded work availability.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block">Instant Syllabus Sync</strong>
                                        <span className="text-slate-400">Changes to your syllabus automatically update the class calendar and student to-do lists.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 aspect-square flex items-center justify-center relative">
                            {/* Conceptual UI Mockup */}
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-2">40%</div>
                                <div className="text-slate-400 uppercase tracking-widest text-sm">Time Saved Wkly</div>
                            </div>
                            <div className="absolute bottom-6 text-xs text-slate-500 italic">Based on average pilot instructor feedback</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

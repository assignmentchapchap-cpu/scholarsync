

import { FeatureHero } from '@/components/features/FeatureHero';
import IntegrityHub from '@/components/landing/IntegrityHub';
import { Shield, Eye, Lock, Scale, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Detection & Integrity | Schologic LMS',
    description: 'Evidence-based academic integrity analysis using multi-model AI detection (RoBERTa, PirateXX) with granular transparency.',
    openGraph: {
        title: 'AI Detection & Integrity | Schologic LMS',
        description: 'Evidence-based academic integrity analysis using multi-model AI detection (RoBERTa, PirateXX) with granular transparency.',
    }
};

export default function AIDetectionPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-24">
            <FeatureHero
                title="Evidence-Based Integrity Analysis"
                description="Schologic uses a multi-model approach to detect AI-generated content with unparalleled accuracy. We provide transparent, granular reporting so you can make informed decisions."
                label="Integrity Hub"
                align="center"
                visual={<IntegrityHub />}
            />

            <div className="container mx-auto px-6">

                {/* 3-Step Process */}
                <div className="max-w-5xl mx-auto mb-32">
                    <h2 className="text-3xl font-serif font-bold text-white mb-16 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 z-0"></div>

                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-4xl font-bold text-slate-700">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Analyze</h3>
                            <p className="text-slate-400">Submissions are scanned against multiple LLM detection models (RoBERTa, PirateXX) simultaneously.</p>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                                <span className="text-4xl font-bold text-indigo-200">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Triangulate</h3>
                            <p className="text-slate-400">We cross-reference probability scores to filter out false positives and identify mixed-authorship patterns.</p>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-4xl font-bold text-slate-700">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Report</h3>
                            <p className="text-slate-400">You receive a detailed heatmap highlighting specific sentences with high AI probability, not just a single score.</p>
                        </div>
                    </div>
                </div>

                {/* Scoring Methods Table */}
                <div className="max-w-4xl mx-auto bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden mb-32">
                    <div className="p-8 border-b border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-2">Flexible Scoring Logic</h2>
                        <p className="text-slate-400">Choose the sensitivity that matches your institutional policy.</p>
                    </div>
                    <div className="divide-y divide-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-4 p-6 gap-4 items-center hover:bg-slate-800/30 transition-colors">
                            <div className="font-bold text-indigo-400">Weighted</div>
                            <div className="col-span-2 text-slate-300 text-sm">Takes the average probability of all highlighted segments. Best for nuanced evaluation.</div>
                            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit">Recommended</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 p-6 gap-4 items-center hover:bg-slate-800/30 transition-colors">
                            <div className="font-bold text-indigo-400">Strict</div>
                            <div className="col-span-2 text-slate-300 text-sm">Only counts segments with &gt;90% AI probability. Minimizes false accusations.</div>
                            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-slate-800 px-3 py-1 rounded-full w-fit">Conservative</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 p-6 gap-4 items-center hover:bg-slate-800/30 transition-colors">
                            <div className="font-bold text-indigo-400">Binary</div>
                            <div className="col-span-2 text-slate-300 text-sm">Flags submission if ANY segment exceeds 50% probability. Maximum scrutiny.</div>
                            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full w-fit">Aggressive</div>
                        </div>
                    </div>
                </div>

                {/* Granularity Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Paragraph vs. Sentence Analysis</h2>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Context matters. A single sentence might sound robotic, but a whole paragraph reveals the writer's voice. Schologic allows you to toggle between granularities to verify your hunch.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
                                    <Scale className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <strong className="text-white block mb-1">Sentence-Level</strong>
                                    <p className="text-sm text-slate-400">Pinpoints specific AI-generated claims or definitions within human-written text.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
                                    <Eye className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <strong className="text-white block mb-1">Paragraph-Level</strong>
                                    <p className="text-sm text-slate-400">Analyzes flow and coherence to detect larger scale generated content.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative">
                        {/* Visualization of granularity */}
                        <div className="space-y-4 font-serif text-slate-300 leading-relaxed">
                            <p className="bg-red-500/20 border-l-2 border-red-500 pl-4 py-1 rounded-r">
                                The concept of semantic vector space is crucial to understanding modern NLP. <span className="bg-red-500/40 text-white px-1 rounded">However, the implementation of transformers revolutionized this field.</span>
                            </p>
                            <div className="flex justify-between text-xs text-slate-500 font-sans mt-2">
                                <span>Analysis: <span className="text-red-400">78% AI Probability</span></span>
                                <span>Model: <span className="text-slate-400">RoBERTa Large</span></span>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Live Preview
                        </div>
                    </div>
                </div>

                {/* Disclaimer/Ethics */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start max-w-3xl mx-auto">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-amber-500 font-bold mb-2">Our Stance on Academic Integrity</h4>
                        <p className="text-sm text-amber-200/80 leading-relaxed">
                            AI detection is probabilistic, not deterministic. We provide these scores as <strong>evidence to support instructor judgment</strong>, not as absolute proof of misconduct. We recommend using our "Weighted" scoring method for the most fair assessment.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

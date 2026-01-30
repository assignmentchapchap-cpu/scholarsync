

import { FeatureHero } from '@/components/features/FeatureHero';
import ApertusTA from '@/components/landing/ApertusTA';
import { Sparkles, MessageSquare, List, TrendingUp, HelpCircle, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Teaching Assistant | Schologic LMS',
    description: 'Your 24/7 grading partner. Generate rubrics, get instant grading insights, and automate routine Q&A with Apertus TA.',
    openGraph: {
        title: 'AI Teaching Assistant | Schologic LMS',
        description: 'Your 24/7 grading partner. Generate rubrics, get instant grading insights, and automate routine Q&A with Apertus TA.',
    }
};

export default function AITeachingAssistantPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-24">
            <FeatureHero
                title="Your 24/7 Grading Partner"
                description="Reduce grading time by 75% without sacrificing quality. Apertus TA drafts feedback, generates rubrics, and answers student questions instantly."
                label="Apertus TA"
                align="center"
                // Using ApertusTA landing component as the visual
                visual={<ApertusTA />}
            />

            <div className="container mx-auto px-6">

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                            <List className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Rubric Generator</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Describe your assignment in plain English, and Apertus generates a detailed, 5-point rubric automatically.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Grading Insights</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Get instant breakdowns of strengths and weaknesses for every submission before you even start reading.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                            <MessageSquare className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Help Assistant</h3>
                        <p className="text-slate-400 leading-relaxed">
                            A built-in chatbot answers student questions about the syllabus or assignment details 24/7.
                        </p>
                    </div>
                </div>


                {/* Grading Logic Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Transparent Scoring Framework</h2>
                        <p className="text-lg text-slate-400 mb-8">
                            Schologic forces deterministic grading logic. Even when AI assists, the final grade is calculated based on strict, customizable multipliers—never a "hallucinated" number.
                        </p>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-800/50 text-slate-300 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 border-b border-slate-800">Performance Level</th>
                                        <th className="p-4 border-b border-slate-800">Score Multiplier</th>
                                        <th className="p-4 border-b border-slate-800">Example (10pt Item)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-400">
                                    <tr>
                                        <td className="p-4 text-emerald-400 font-bold">Exceptional</td>
                                        <td className="p-4">1.00 (100%)</td>
                                        <td className="p-4">10.0 pts</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-indigo-400 font-bold">Good</td>
                                        <td className="p-4">0.85 (85%)</td>
                                        <td className="p-4">8.5 pts</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sky-400 font-bold">Fair</td>
                                        <td className="p-4">0.60 (60%)</td>
                                        <td className="p-4">6.0 pts</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-rose-400 font-bold">Poor / Missing</td>
                                        <td className="p-4">0.20 (20%)</td>
                                        <td className="p-4">2.0 pts</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <HelpCircle className="w-8 h-8 text-amber-500" />
                                Instant Help Chatbot
                            </h3>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                "When is the midterm?" "Is this PDF the right reading?" Stop answering the same emails. Our Help Assistant ingests your syllabus and documents to answer logistical questions automatically.
                            </p>
                            <div className="space-y-4">
                                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-sm max-w-[90%]">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold tracking-wider">Student</p>
                                    <p className="text-slate-200 text-sm">Do I need to cite outside sources for the Essay #2?</p>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl rounded-tr-sm max-w-[90%] ml-auto">
                                    <p className="text-amber-500 text-xs mb-1 uppercase font-bold tracking-wider flex items-center gap-1"><Sparkles className="w-3 h-3" /> Assistant</p>
                                    <p className="text-white text-sm">Yes. According to the syllabus page 4, Essay #2 requires at least three external peer-reviewed sources formatted in MLA style.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Human in the Loop CTA */}
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">AI Drafts, You Decide.</h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Schologic never auto-submits grades. The AI provides a suggested score and reasoning, but the instructor always has the final click.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/features/ai-teaching-assistant#pilot" className="text-white font-bold border-b border-amber-500 pb-0.5 hover:text-amber-400 transition-colors flex items-center gap-2">
                            Explore Ethical AI Grading <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

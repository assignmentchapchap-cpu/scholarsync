

import { FeatureHero } from '@/components/features/FeatureHero';
import { Library, Upload, Download, CheckCircle, GraduationCap, DollarSign, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OER Library & ZTC | Schologic LMS',
    description: 'Zero Textbook Costs. Infinite Possibilities. Import high-quality OER content from LibreTexts and OpenStax directly into your course.',
    openGraph: {
        title: 'OER Library & ZTC | Schologic LMS',
        description: 'Zero Textbook Costs. Infinite Possibilities. Import high-quality OER content from LibreTexts and OpenStax directly into your course.',
    }
};

export default function OERLibraryPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-24">
            <FeatureHero
                title="Zero Textbook Costs. Infinite Possibilities."
                description="Replace expensive textbooks with high-quality, peer-reviewed Open Educational Resources (OER). Import content directly from LibreTexts, OpenStax, and more."
                label="OER Library"
                align="center"
                visual={
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

                        {/* Import Flow Visualization */}
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full max-w-4xl justify-center">
                            {/* Source */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl w-64 text-center">
                                <div className="text-slate-900 font-serif font-bold text-2xl mb-2">LibreTexts</div>
                                <div className="text-slate-500 text-sm mb-4">Chemistry 101</div>
                                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle className="w-3 h-3" /> Creative Commons
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex flex-col items-center gap-2 text-indigo-400">
                                <div className="h-0.5 w-16 bg-indigo-500/30"></div>
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                                    <Download className="w-4 h-4" />
                                </div>
                                <div className="h-0.5 w-16 bg-indigo-500/30"></div>
                            </div>

                            {/* Destination */}
                            <div className="bg-slate-950 border-2 border-indigo-500 p-6 rounded-2xl shadow-2xl shadow-indigo-500/20 w-64 text-center relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">Imported to Course</div>
                                <div className="text-white font-serif font-bold text-2xl mb-2">Schologic</div>
                                <div className="text-indigo-300 text-sm mb-4">Lecture 1: Atoms</div>
                                <div className="flex justify-center gap-2">
                                    <div className="h-2 w-8 bg-slate-800 rounded-full"></div>
                                    <div className="h-2 w-12 bg-slate-800 rounded-full"></div>
                                    <div className="h-2 w-6 bg-slate-800 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            <div className="container mx-auto px-6">

                {/* Integration Logos */}
                <div className="flex flex-wrap justify-center gap-12 opacity-50 mb-32 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Text as SVG/Logos are complex to hardcode */}
                    <div className="text-2xl font-bold font-serif text-slate-400">LibreTexts</div>
                    <div className="text-2xl font-bold font-serif text-slate-400">OpenStax</div>
                    <div className="text-2xl font-bold font-serif text-slate-400">Merlot</div>
                    <div className="text-2xl font-bold font-serif text-slate-400">OER Commons</div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/50 hover:bg-slate-800 transition-all">
                        <DollarSign className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Save Students Money</h3>
                        <p className="text-slate-400 leading-relaxed">
                            The average student spends $1,200/year on textbooks. Elimating this cost removes a major barrier to access and improves enrollment rates.
                        </p>
                    </div>
                    <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/50 hover:bg-slate-800 transition-all">
                        <Globe className="w-10 h-10 text-indigo-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Live Updates</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Unlike static PDFs, linked OER content stays formatted for the web and receives updates whenever the source repository is improved.
                        </p>
                    </div>
                    <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/50 hover:bg-slate-800 transition-all">
                        <Upload className="w-10 h-10 text-blue-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Easy Migration</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Already using OER in Canvas or Blackboard? We support Common Cartridge (LTI 1.3) specifically for OER links, preserving your curriculum structure.
                        </p>
                    </div>
                </div>

                {/* ZTC Badge Section */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-16 border border-slate-800 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <CheckCircle className="w-4 h-4" /> Compliance Ready
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-6">Automated ZTC Certification</h2>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            In many states (like California's ZTC degree program), courses labeled "Zero Textbook Cost" receive priority funding and student registration search highlights.
                        </p>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Schologic automatically tags your course as ZTC if it detects only OER materials are assigned, simplifying your reporting requirements.
                        </p>
                        <Link href="#pilot" className="inline-flex items-center gap-2 text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl transition-colors">
                            Start a ZTC Pilot <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex-shrink-0 relative">
                        <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] absolute inset-0"></div>
                        <div className="relative z-10 bg-slate-950 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center rotate-3 hover:rotate-0 transition-transform duration-500">
                            <GraduationCap className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <div className="text-2xl font-bold text-white mb-1">ZTC Certified</div>
                            <div className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Zero Textbook Cost</div>
                            <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 text-xs">Verified by Schologic</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

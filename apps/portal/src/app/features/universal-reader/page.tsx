

import { FeatureHero } from '@/components/features/FeatureHero';
import UniversalReader from '@/components/landing/UniversalReader';
import { FileText, BookOpen, Search, List, Sparkles, Box, FileType, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Universal Reader | Schologic LMS',
    description: 'A single, unified interface for all course content. Read PDFs, DOCX, and IMSCC archives with built-in AI study tools.',
    openGraph: {
        title: 'Universal Reader | Schologic LMS',
        description: 'A single, unified interface for all course content. Read PDFs, DOCX, and IMSCC archives with built-in AI study tools.',
    }
};

export default function UniversalReaderPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-24">
            <FeatureHero
                title="Any Content. One Interface."
                description="Stop forcing students to download five different file types. The Universal Reader streams PDFs, Word docs, and Canvas archives directly in the browser with a unified, distraction-free UI."
                label="Universal Reader"
                align="center"
                visual={<UniversalReader />}
            />

            <div className="container mx-auto px-6">

                {/* File Format Compatibility Table */}
                <div className="max-w-4xl mx-auto mb-32">
                    <h2 className="text-3xl font-serif font-bold text-white mb-16 text-center">Format Agnostic</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-blue-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FileType className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-white font-bold mb-1">PDF</h3>
                            <p className="text-sm text-slate-400">Native rendering with vector sharpness at any zoom level.</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-blue-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-white font-bold mb-1">DOCX</h3>
                            <p className="text-sm text-slate-400">Microsoft Word files render with original formatting intact.</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-blue-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Box className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-white font-bold mb-1">IMSCC</h3>
                            <p className="text-sm text-slate-400">Full Common Cartridge support for importing entire courses.</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-blue-500/50 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-white font-bold mb-1">EPUB</h3>
                            <p className="text-sm text-slate-400">Reflowable text ideal for reading on mobile devices.</p>
                        </div>
                    </div>
                </div>

                {/* Smart Study Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        {/* Visual Representation of Tools */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex gap-4 items-center">
                                <Search className="w-5 h-5 text-slate-400" />
                                <div className="h-2 w-32 bg-slate-800 rounded"></div>
                                <div className="ml-auto text-xs text-slate-500">24 matches found</div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Summary</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-800 rounded"></div>
                                    <div className="h-2 w-5/6 bg-slate-800 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex gap-4">
                                <List className="w-5 h-5 text-slate-400 shrink-0" />
                                <div>
                                    <div className="h-3 w-40 bg-slate-700 rounded mb-2"></div>
                                    <div className="pl-4 border-l border-slate-800 space-y-2">
                                        <div className="h-2 w-32 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-24 bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            Active Reading
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Tools That Deepen Comprehension</h2>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <strong className="text-white block text-lg mb-1">Contextual Search</strong>
                                    <p className="text-slate-400">Instantly find definitions or key concepts across the entire document, not just exact keyword matches.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <strong className="text-white block text-lg mb-1">Auto-Generated Table of Contents</strong>
                                    <p className="text-slate-400">Schologic parses document structure to create a clickable TOC, even for older PDFs that lack bookmarks.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <strong className="text-white block text-lg mb-1">Key Concept Extraction</strong>
                                    <p className="text-slate-400">AI automatically highlights crucial terms and generates flashcards for review.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

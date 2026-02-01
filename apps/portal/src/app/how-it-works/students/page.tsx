'use client';

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { Sparkles, Brain, Clock, Bookmark } from "lucide-react";

export default function StudentsPage() {
    return (
        <div className="pb-24">
            <HowItWorksHero
                title="Your Personal Ai Tutor."
                subtitle="Not just for answers. An AI companion that helps you understand the material, study smarter, and ace the exam."
                label="For Students"
                accentColor="purple"
            />

            <SectionGrid>
                <GridColumn span={6} className="order-2 md:order-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Context-Aware Help</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Ask questions about your specific course readings. The AI knows exactly what's on page 42 of your textbook and can explain complex concepts in simple terms.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Learn, Don't Just Copy</h2>
                        <p className="text-slate-600">
                            Schologic is designed to help you learn. Instead of just giving you the essay, it helps you brainstorm ideas, outline your arguments, and find relevant citations from your course material.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid>
                <GridColumn span={6} className="flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">One App, Everything</h2>
                        <p className="text-slate-600">
                            No more switching between PDF readers, Word, and the LMS. Read your notes, watch lectures, and submit assignments all in one place.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                            <Bookmark className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Universal Reader</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Every file type works instantly. PDFs, docs, slides—they all open in our fast, streaming reader, even on slow connections.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid className="bg-purple-50/50 rounded-3xl mt-12">
                <GridColumn span={8} className="mx-auto text-center">
                    <Brain className="w-12 h-12 text-purple-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Start Your Learning Journey</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Join thousands of students who are graduating with better grades and zero textbook debt.
                    </p>
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                        Sign Up for Free
                    </button>
                </GridColumn>
            </SectionGrid>
        </div>
    );
}

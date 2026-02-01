'use client';

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";

export default function InstructorsPage() {
    return (
        <div className="pb-24">
            <HowItWorksHero
                title="Teach More, Grade Less."
                subtitle="Your AI teaching assistant handles the repetitive administration, so you can focus on student mentorship."
                label="For Instructors"
                accentColor="rose"
            />

            <SectionGrid>
                <GridColumn span={6} className="order-2 md:order-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6">
                            <Clock className="w-6 h-6 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Automated Grading Drafts</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Upload student submissions (PDF, Docx, or scanned images). Our AI analyzes them against your rubric and suggests a grade with detailed feedback comments.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Reduces grading time by 70%</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Consistent feedback across all students</span>
                            </li>
                        </ul>
                    </div>
                </GridColumn>
                <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">You Stay in Control</h2>
                        <p className="text-slate-600">
                            The AI never publishes grades automatically. You review every suggestion, edit the feedback if needed, and approve the final score. It's a "human-in-the-loop" system designed to augment your expertise, not replace it.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid>
                <GridColumn span={6} className="flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Instant Rubric Generation</h2>
                        <p className="text-slate-600">
                            Struggling to define success criteria? Paste your assignment prompt, and Schologic generates a detailed, matrix-style rubric aligned with Bloom's Taxonomy.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6">
                            <FileText className="w-6 h-6 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Structured Assessment</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Create clarity for your students. Generated rubrics can be exported to PDF or directly attached to the assignment in the LMS.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Aligns with curriculum standards</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Fully editable criteria</span>
                            </li>
                        </ul>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid className="bg-rose-50/50 rounded-3xl mt-12">
                <GridColumn span={8} className="mx-auto text-center">
                    <TrendingUp className="w-12 h-12 text-rose-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Identify At-Risk Students Early</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Our dashboard highlights students who are falling behind based on engagement and grade trends, allowing you to intervene before it's too late.
                    </p>
                    <button className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">
                        Start Your Free Pilot
                    </button>
                </GridColumn>
            </SectionGrid>
        </div>
    );
}

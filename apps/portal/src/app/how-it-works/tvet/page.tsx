'use client';

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { Settings, BookOpen, Award, CheckCircle } from "lucide-react";

export default function TVETPage() {
    return (
        <div className="pb-24">
            <HowItWorksHero
                title="Skills First. Theory Second."
                subtitle="Competency-Based Education (CBET) tools designed for technical and vocational training."
                label="For TVET"
                accentColor="emerald"
            />

            <SectionGrid>
                <GridColumn span={6} className="order-2 md:order-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                            <Settings className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Competency Tracking</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Move beyond letter grades. Track specific practical skills (e.g., "Maintains transparency in welding"). Our rubric system supports binary (Met/Not Met) and leveled competency assessments.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Built for CBET</h2>
                        <p className="text-slate-600">
                            The Competency-Based Education and Training (CBET) curriculum requires a different approach. Schologic allows instructors to map assessments directly to industry standards and specific unit competencies.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid>
                <GridColumn span={6} className="flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Industry Linkages</h2>
                        <p className="text-slate-600">
                            Prepare students for the workforce. Generate skill-based transcripts that employers can understand, showing exactly what a student can *do*, not just what they know.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Employability Passports</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Students build a portfolio of verifiable skills throughout their course, creating a dynamic CV that connects them to internship and job opportunities.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid className="bg-emerald-50/50 rounded-3xl mt-12">
                <GridColumn span={8} className="mx-auto text-center">
                    <Award className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Equip Your Workforce</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Modernize your vocational training with tools built for the workshop, not just the classroom.
                    </p>
                    <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                        Get CBET Ready
                    </button>
                </GridColumn>
            </SectionGrid>
        </div>
    );
}

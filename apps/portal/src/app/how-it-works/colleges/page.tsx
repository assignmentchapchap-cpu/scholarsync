'use client';

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { BookOpen, FileText, ArrowRight, CheckCircle } from "lucide-react";

export default function CollegesPage() {
    return (
        <div className="pb-24">
            <HowItWorksHero
                title="Digital Transition, Zero Friction."
                subtitle="Eliminate textbook costs and unify your campus management in one secure, scalable platform."
                label="For Colleges"
                accentColor="amber"
            />

            <SectionGrid>
                <GridColumn span={6} className="order-2 md:order-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                            <CheckCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Zero-Textbook-Cost (ZTC) Mandate</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Meet government ZTC requirements instantly. Our Universal Reader integrates perfectly with Open Educational Resources (OER), saving your students thousands of shillings per semester.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Affordable for Everyone</h2>
                        <p className="text-slate-600">
                            We believe financial barriers shouldn't stop learning. Schologic helps colleges transition away from expensive proprietary textbooks to high-quality, open-license alternatives without sacrificing the reading experience.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid>
                <GridColumn span={6} className="flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Unified Campus Management</h2>
                        <p className="text-slate-600">
                            Stop juggling five different systems for grades, attendance, and content. Schologic provides a single "Operating System" for your college, reducing IT overhead and training time.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">All-in-One Dashboard</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Admins get a bird's-eye view of campus performance. Track attendance, monitor course completion rates, and manage instructor workloads from one central hub.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid className="bg-amber-50/50 rounded-3xl mt-12 text-center">
                <GridColumn span={8} className="mx-auto">
                    <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Ready to go Digital?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Join the colleges leading the digital revolution in Kenya.
                    </p>
                    <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 flex items-center gap-2 mx-auto">
                        Schedule a Demo <ArrowRight className="w-5 h-5" />
                    </button>
                </GridColumn>
            </SectionGrid>
        </div >
    );
}

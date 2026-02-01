'use client';

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { ShieldCheck, Database, Server, Search } from "lucide-react";

export default function UniversitiesPage() {
    return (
        <div className="pb-24">
            <HowItWorksHero
                title="Sovereign Integrity."
                subtitle="Protect your institution's reputation with AI-resistant assessment and on-premise data control."
                label="For Universities"
                accentColor="blue"
            />

            <SectionGrid>
                <GridColumn span={6} className="order-2 md:order-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Linguistic Forensic Analysis</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Standard AI detectors are failing. Schologic uses advanced linguistic forensics to analyze the *provenance* of student work, ensuring the authenticity of degrees and certifications.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Academic Integrity 2.0</h2>
                        <p className="text-slate-600">
                            In the age of ChatGPT, integrity requires more than just plagiarism checking. We provide a comprehensive suite of tools to verify authorship and encourage original thought.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid>
                <GridColumn span={6} className="flex items-center">
                    <div className="prose prose-lg prose-slate">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Data Sovereignty</h2>
                        <p className="text-slate-600">
                            Your data is your asset. Unlike cloud-only LMS providers that lock you in, Schologic offers on-premise deployment options for universities that need full control over their student data and IP.
                        </p>
                    </div>
                </GridColumn>
                <GridColumn span={6}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                            <Database className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">On-Prem & Hybrid</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Deploy on your own servers or in a dedicated private cloud. Ensure compliance with data protection laws and maintain complete ownership of your institutional knowledge base.
                        </p>
                    </div>
                </GridColumn>
            </SectionGrid>

            <SectionGrid className="bg-indigo-50/50 rounded-3xl mt-12">
                <GridColumn span={8} className="mx-auto text-center">
                    <Server className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Secure Your Infrastructure</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Enterprise-grade security and scalability for leading research institutions.
                    </p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                        Contact Enterprise Sales
                    </button>
                </GridColumn>
            </SectionGrid>
        </div>
    );
}

import { FeatureHero } from '@/components/features/FeatureHero';
import { ClassSetupWorkflow } from '@/components/features/class-manager/ClassSetupWorkflow';
import { AssessmentFeatures } from '@/components/features/class-manager/AssessmentFeatures';
import { GradingDeepDive } from '@/components/features/class-manager/GradingDeepDive';
import { EcosystemLinks } from '@/components/features/class-manager/EcosystemLinks';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Class Manager | Schologic LMS',
    description: 'The command center for your teaching workflow. Manage students, assignments, and grades in a single, intuitive dashboard.',
    openGraph: {
        title: 'Class Manager | Schologic LMS',
        description: 'The command center for your teaching workflow. Manage students, assignments, and grades in a single, intuitive dashboard.',
    }
};

export default function ClassManagerPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
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

            {/* Intro Stat */}
            <div className="max-w-3xl mx-auto text-center mb-24 px-6 pt-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Built for the Modern Instructor</h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                    Traditional LMS interfaces are cluttered and confusing. Schologic's Class Manager strips away the noise, focusing on the three things that matter most: <span className="text-white font-bold">Content, Engagement, and Assessment.</span>
                </p>
            </div>

            {/* Pillar Content Sections */}
            <ClassSetupWorkflow />
            <AssessmentFeatures />
            <GradingDeepDive />
            <EcosystemLinks />
        </div>
    );
}

import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { Maximize2, Layers, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LMS for Colleges in Kenya | Hybrid Learning Platform | Schologic",
    description: "The academic engine for colleges. Deliver full-time, evening, and distance programs through one unified hybrid learning platform.",
    keywords: ["LMS for colleges Kenya", "hybrid learning platform", "multi-mode delivery", "distance education LMS", "academic integrity", "enrollment capacity"],
};

export default function CollegesPage() {
    return (
        <div>
            <HowItWorksHero
                title="The Lean Academic Engine for Modern Colleges."
                subtitle="Deliver full-time, evening, and distance programs through one unified platform. Maximize capacity, empower instructors, and protect credentials."
                label="For Colleges"
                accentColor="amber"
                visualPosition="left"
                visual={
                    <div className="relative w-full max-w-[400px] aspect-square">
                        <Image
                            src="/images/colleges/abstract-hero.svg"
                            alt=""
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                }
            />

            {/* Section 1: The Capacity Challenge - Amber Background */}
            <div className="bg-amber-50 py-24">
                <SectionGrid>
                    <GridColumn span={6} className="order-2 md:order-1">
                        <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-sm h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                                <Maximize2 className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Don't Let Physical Walls Limit Your Mission</h3>
                            <div className="text-slate-600 leading-relaxed space-y-4 relative z-10">
                                <p>
                                    Kenya's colleges face a persistent challenge: enrollment demand continues to grow, but classroom space remains fixed. Building new infrastructure is expensive and slow. Yet administrators are under pressure to admit more students, serve working professionals through evening programs, and increasingly, offer distance learning options.
                                </p>
                                <p>
                                    Schologic provides a <strong>hybrid learning platform</strong> that extends your campus beyond its boundaries. With our <strong>multi-mode delivery system</strong>, the same course materials and assessments serve full-time day students, evening learners, and distance education participants. Effectively double your enrollment capacity without constructing a new classroom.
                                </p>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                        <div className="prose prose-lg prose-slate pl-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">One Campus. Limitless Reach.</h2>
                            <p className="text-slate-600 mb-8">
                                Whether a student attends in person, joins an evening session after work, or completes their program online, they access the same <strong>quality learning experience</strong> through a mobile-responsive platform designed for the modern Kenyan learner.
                            </p>
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                <Image
                                    src="/images/colleges/hybrid-campus.jpg"
                                    alt="Schologic Hybrid Learning Platform - Students studying in physical classrooms and participating via distance education in Kenya"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 2: Unified Platform - White Background */}
            <div className="bg-white py-24">
                <SectionGrid>
                    <GridColumn span={6} className="flex items-center">
                        <div className="prose prose-lg prose-slate pr-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Full-Time. Evening. Distance. One Standard.</h2>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    Traditional administration often means managing separate systems for different student populations. This fragmentation leads to duplicated work and inconsistent standards.
                                </p>
                                <p>
                                    Schologic consolidates all delivery modes into a <strong>single unified platform</strong>. Full-time students taking assessments on campus use the same system as distance learners in Mombasa. Evening students accessing materials after work use the same interface.
                                </p>
                                <p>
                                    Our <strong>blended learning architecture</strong> guarantees that every student—regardless of mode—earns a credential of equal value.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/features/class-manager" className="text-amber-600 font-bold hover:text-amber-700 inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-full hover:bg-amber-100 transition-colors">
                                    Learn more about the Class Manager <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6}>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full relative">
                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full opacity-50 blur-2xl" />

                            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-8">
                                <Layers className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Unified Delivery Manager</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">Multi-Mode Enrollment</strong>
                                        <p className="text-slate-600 leading-relaxed">Batch-enroll students into full-time, evening, or distance tracks from one dashboard.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">Unified Assessment</strong>
                                        <p className="text-slate-600 leading-relaxed">One gradebook, one set of rubrics, one standard applied across all formats.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">Cross-Mode Analytics</strong>
                                        <p className="text-slate-600 leading-relaxed">Track performance and engagement regardless of attendance mode.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 3: Instructor Empowerment - Dark Theme for Contrast */}
            <div className="bg-slate-900 py-24 relative overflow-hidden bg-dot-white/20">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                <SectionGrid>
                    <GridColumn span={6} className="order-2 md:order-1">
                        <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl h-full relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                                    <Users className="w-7 h-7 text-amber-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Give Faculty Back <br /><span className="text-amber-400">10 Hours Every Week</span></h3>
                            </div>

                            <div className="text-slate-300 leading-relaxed space-y-6 text-lg">
                                <p>
                                    In many Kenyan colleges, the same instructor teaches day, evening, and distance sections. Without proper tools, this means triple the administrative work: separate rosters, multiple gradebooks, and manual tracking.
                                </p>
                                <p>
                                    Schologic's <strong>instructor efficiency tools</strong> eliminate this redundancy. Content uploaded once is available to all. Rubrics apply consistently across modes. Attendance and grading are automated.
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-700">
                                <Link href="/features/ai-teaching-assistant" className="text-amber-400 font-bold hover:text-amber-300 inline-flex items-center gap-2">
                                    Explore AI Teaching Assistant <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                        <div className="pl-6">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">Zero Extra Work.</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-3 min-w-[6px]" />
                                    <span className="text-lg text-slate-300"><strong>Automated Enrollment Sync:</strong> No manual data entry for add/drops.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-3 min-w-[6px]" />
                                    <span className="text-lg text-slate-300"><strong>AI-Assisted Grading:</strong> Initial feedback generated automatically.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-3 min-w-[6px]" />
                                    <span className="text-lg text-slate-300"><strong>Unified Attendance:</strong> Single view for in-person and online participation.</span>
                                </li>
                            </ul>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 4: Student Retention - White Background */}
            <div className="bg-white py-24">
                <SectionGrid>
                    <GridColumn span={6} className="flex items-center">
                        <div className="prose prose-lg prose-slate pr-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Keep Every Student Connected</h2>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    Student dropout is a significant concern, particularly among evening and distance learners balancing work and family. Disengagement quickly leads to dropout without intervention.
                                </p>
                                <p>
                                    Schologic's <strong>student success platform</strong> provides early warning indicators. Our analytics track grades, login frequency, and content interaction. When a student disengages—whether full-time or distance—the system flags them for follow-up.
                                </p>
                                <p>
                                    For students, a <strong>modern, mobile-first interface</strong> clearly displays deadlines and progress, making the learning path transparent and accessible.
                                </p>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6}>
                        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 h-full">
                            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-8">
                                <TrendingUp className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Retention & Success</h3>
                            <ul className="space-y-5">
                                <li className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">At-Risk Alerts</strong>
                                        <p className="text-sm text-slate-600">Automated notifications when engagement drops below thresholds.</p>
                                    </div>
                                </li>
                                <li className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Mobile-Responsive</strong>
                                        <p className="text-sm text-slate-600">Students access coursework from any device, anywhere.</p>
                                    </div>
                                </li>
                                <li className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Clear Progress Tracking</strong>
                                        <p className="text-sm text-slate-600">Visual dashboards show exactly where students stand.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 5: Academic Integrity (CTA) - Gradient Background */}
            <div className="bg-gradient-to-b from-amber-50 to-white py-24 text-center bg-grid-amber-500/10">
                <SectionGrid>
                    <GridColumn span={8} className="mx-auto">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-amber-900/5 flex items-center justify-center mx-auto mb-8 transform rotate-3">
                            <Shield className="w-10 h-10 text-amber-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">One Standard. Verified Achievement.</h2>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Combat the perception that evening or online programs are less rigorous. Schologic integrates secure assessment tools, AI content detection, and digital proctoring into every course.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-xl shadow-amber-600/20 flex items-center gap-2">
                                Launch Your Hybrid Campus <ArrowRight className="w-5 h-5" />
                            </button>
                            <Link href="/features/ai-detection" className="text-slate-600 font-bold hover:text-amber-600 transition-colors flex items-center gap-2 text-lg">
                                Explore Integrity Tools
                            </Link>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>
        </div>
    );
}

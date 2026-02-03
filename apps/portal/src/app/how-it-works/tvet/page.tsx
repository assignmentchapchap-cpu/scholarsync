import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { SectionGrid, GridColumn } from "@/components/how-it-works/SectionGrid";
import { TvetPilotCTA } from "@/components/how-it-works/tvet/TvetPilotCTA";
import { Maximize2, Layers, Users, TrendingUp, Shield, ArrowRight, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LMS for TVET Institutions in Kenya | Digital Learning Platform | Schologic",
    description: "Schologic is the operating system for Competency-Based Education (CBET). Automate CDACC compliance, track industrial attachment, and deliver TVET theory online.",
    keywords: [
        "TVET LMS Kenya",
        "CBET assessment tool",
        "CDACC compliance software",
        "TVET capitation reporting system",
        "industrial attachment tracking",
        "continuing technical education",
        "Schologic for TVET"
    ],
};

export default function TvetPage() {
    return (
        <div>
            <HowItWorksHero
                title="The Operating System for Competency-Based Excellence."
                subtitle="Manage the complexity of CBET with one platform. Sync theory, track industrial attachment, and simplify CDACC compliance without adding administrative weight."
                label="For TVET Institutions"
                accentColor="emerald"
                visualPosition="left"
                visual={
                    <div className="relative w-full max-w-[400px] aspect-square">
                        <Image
                            src="/images/colleges/abstract-hero.svg"
                            alt=""
                            fill
                            className="object-contain" // Reusing colleges hero temporarily
                            priority
                        />
                    </div>
                }
            />

            {/* Section 1: Hybrid Mastery - Emerald Background */}
            <div className="bg-emerald-50 py-24">
                <SectionGrid>
                    <GridColumn span={6} className="order-2 md:order-1">
                        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                                <Maximize2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Bridge the gap between digital delivery and classroom excellence.</h3>
                            <div className="text-slate-600 leading-relaxed space-y-4 relative z-10">
                                <p>
                                    Schologic provides a robust environment for hybrid learning, allowing instructors to host synchronous online classes and distribute curriculum resources seamlessly.
                                </p>
                                <p>
                                    By digitizing the theoretical framework, our platform ensures that formative assessments are not just tasks, but data-driven milestones that prepare students for high-stakes performance through automated grading and instant feedback loops.
                                </p>
                                <p>
                                    This strategic shift allows institutions to scale capacity without compromising quality, ensuring that every student—whether on-campus or remote—receives the same rigorous preparation. Instructors transition from being content delivery machines to true mentors, focusing their energy on refining strict practical skills in the workshop rather than repeating basic theory.
                                </p>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6} className="order-1 md:order-2 flex items-center">
                        <div className="prose prose-lg prose-slate pl-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Sync Theory, Master Practice.</h2>
                            <p className="text-slate-600 mb-8">
                                Reach 500 students as easily as 50. High-quality theory delivery prepares students for high-stakes practicals, ensuring they are ready for the workshop.
                            </p>
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                <Image
                                    src="/images/colleges/tvet learners schologic lms.svg"
                                    alt="TVET Hybrid Learning - Students using Schologic LMS for theory lessons before practical workshops"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <div className="mt-6">
                                <Link href="/features/class-manager" className="text-emerald-600 font-bold hover:text-emerald-700 inline-flex items-center gap-2">
                                    Classroom Management Tools <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 2: Faculty Force Multiplier - White Background */}
            <div className="bg-white py-24">
                <SectionGrid>
                    <GridColumn span={6} className="flex items-center">
                        <div className="prose prose-lg prose-slate pr-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">The Faculty Force Multiplier.</h2>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    Break the cycle of faculty exhaustion and administrative fatigue. Schologic acts as a strategic <strong>force multiplier</strong>, utilizing admin automation and bulk enrollment tools to help a single instructor manage massive student-to-staff ratios without losing the personal touch.
                                </p>
                                <p>
                                    By offloading routine "busy work" to our smart engine, your institution achieves <strong>instructional scaling</strong> that maintains high standards while directly reducing instructor burnout and operational friction.
                                </p>
                                <p>
                                    Whether managing day classes, evening cohorts, or distance learners, faculty can now focus on what truly matters: <strong>teaching, mentoring, and developing competent graduates</strong> ready for the workforce.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/features/ai-teaching-assistant" className="text-emerald-600 font-bold hover:text-emerald-700 inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
                                    Explore Teaching Assistant <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6}>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full relative">
                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full opacity-50 blur-2xl" />

                            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-8">
                                <Layers className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Instructor Superpowers</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">Centralized Grading</strong>
                                        <p className="text-slate-600 leading-relaxed">One unified gradebook for all cohorts. Grade once, update everywhere.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">AI Teaching Assistant</strong>
                                        <p className="text-slate-600 leading-relaxed">Automated first-pass grading and instant student feedback powered by AI.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900 text-lg mb-1">Flexibility & Convenience</strong>
                                        <p className="text-slate-600 leading-relaxed">Manage classes from anywhere. Mobile-friendly dashboards for on-the-go access.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 3: Institutional Nerve Center - Dark Theme */}
            <div className="bg-slate-900 py-24 relative overflow-hidden bg-dot-white/20">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <SectionGrid>
                    <GridColumn span={6} className="order-2 md:order-1">
                        <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl h-full relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                                    <Users className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">From Campus to <br /><span className="text-emerald-400">Industrial Attachment</span></h3>
                            </div>

                            <div className="text-slate-300 leading-relaxed space-y-6 text-lg">
                                <p>
                                    The student journey doesn't end at the gate. Managing hundreds of students on <strong>Industrial Attachment</strong> is often a blind spot for traditional systems.
                                </p>
                                <p>
                                    Schologic extends your oversight into the field. Use <strong>Digital Logbooks</strong> and GPS-verified supervision tools to monitor attachment progress as easily as on-campus classes.
                                </p>
                                <p>
                                    This digital continuity ensures that <strong>Industry Supervisors</strong> can grade competencies in real-time, effectively bridging the disconnect between institutional training and actual market requirements while adhering to the rigorous assessment standards demanded by modern industries.
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-700">
                                <div className="text-emerald-400 font-bold text-lg mb-2">100% Field Visibility</div>
                                <div className="text-slate-400 text-sm">Track attachment progress in real-time.</div>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6} className="order-1 md:order-2 flex items-center justify-center relative">
                        {/* Laptop Mockup Container */}
                        <div className="relative w-full max-w-lg perspective-1000">

                            {/* Floating Feature Bubbles - Emerald Theme */}
                            <div className="absolute -left-12 top-0 z-20 animate-float-slow hidden md:flex items-center gap-3 bg-white border-l-4 border-l-emerald-500 p-3 rounded-lg shadow-xl max-w-[200px]">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Audit-Ready</div>
                                    <div className="text-[10px] text-slate-500 leading-tight">Always compliance ready</div>
                                </div>
                            </div>

                            <div className="absolute -right-8 bottom-20 z-20 animate-float-delayed hidden md:flex items-center gap-3 bg-white border-l-4 border-l-blue-500 p-3 rounded-lg shadow-xl max-w-[220px]">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Real-Track</div>
                                    <div className="text-[10px] text-slate-500 leading-tight">Live progress monitoring</div>
                                </div>
                            </div>

                            <div className="absolute right-0 -top-12 z-20 animate-float hidden md:flex items-center gap-3 bg-white border-l-4 border-l-amber-500 p-3 rounded-lg shadow-xl max-w-[200px]">
                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Unified Grades</div>
                                    <div className="text-[10px] text-slate-500 leading-tight">Centralized academic record</div>
                                </div>
                            </div>

                            {/* Laptop Base */}
                            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[250px] md:h-[300px] w-full max-w-[500px] shadow-2xl">
                                <div className="rounded-lg overflow-hidden h-full w-full bg-slate-900 relative">
                                    <Image
                                        src="/images/colleges/instructor-dashboard.png"
                                        alt="TVET Institutional Dashboard - Real-time analytics and grade tracking"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                            </div>
                            <div className="relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-[20px] max-w-[550px] md:w-[110%] -ml-[5%] shadow-xl"></div>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 4: Economy of Excellence / ZTC - White Background */}
            <div className="bg-white py-24">
                <SectionGrid>
                    <GridColumn span={6} className="flex items-center">
                        <div className="prose prose-lg prose-slate pr-6">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Shift Budget from Paper to Power Tools.</h2>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    Consumables and workshop equipment are expensive. Don't let textbooks eat your remaining budget for practical training.
                                </p>
                                <p>
                                    By adopting our <strong>Zero Textbook Cost (ZTC)</strong> model with integrated Open Educational Resources (OER), you free up millions in capital to invest in modern workshop equipment that acts as the real differentiator for your graduates.
                                </p>
                                <p>
                                    Modernize your institutional library with a <strong>Digital Repository</strong> that remains perpetually current, unlike physical books that become obsolete the moment they are printed, ensuring your students always learn from the latest standards and technologies.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/features/universal-reader" className="text-emerald-600 font-bold hover:text-emerald-700 inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
                                    Learn about ZTC <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </GridColumn>
                    <GridColumn span={6}>
                        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 h-full">
                            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-8">
                                <TrendingUp className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Savings & Sustainability</h3>
                            <ul className="space-y-5">
                                <li className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">OER Integration</strong>
                                        <p className="text-sm text-slate-600">Lower student costs with integrated open resources.</p>
                                    </div>
                                </li>
                                <li className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Cloud-Native</strong>
                                        <p className="text-sm text-slate-600">Zero server maintenance or expensive on-premise hardware.</p>
                                    </div>
                                </li>
                                <li className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Scalable Infrastructure</strong>
                                        <p className="text-sm text-slate-600">Pay for usage, not idle metal. Scale instantly.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>

            {/* Section 5: CTA - Gradient Background */}
            <div className="bg-gradient-to-b from-emerald-50 to-white py-24 text-center bg-grid-emerald-500/10">
                <SectionGrid>
                    <GridColumn span={8} className="mx-auto">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-emerald-900/5 flex items-center justify-center mx-auto mb-8 transform rotate-3">
                            <Shield className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">The Future of TVET is Digital.</h2>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join forward-thinking institutions building capacity, relief, and reputation. Schologic integrates secure assessment tools, AI content detection, and digital proctoring into every course.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <TvetPilotCTA />
                            <Link href="/features" className="text-slate-600 font-bold hover:text-emerald-600 transition-colors flex items-center gap-2 text-lg">
                                Explore All Features <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </GridColumn>
                </SectionGrid>
            </div>
        </div>
    );
}

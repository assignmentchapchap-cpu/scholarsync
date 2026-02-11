'use client';

import { SectionGrid, GridColumn } from "./SectionGrid";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    question: string;
    answer: string;
    category?: string;
}

function FAQItem({ question, answer, category }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-start justify-between text-left group"
                aria-expanded={isOpen}
            >
                <div>
                    {category && (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                            {category}
                        </span>
                    )}
                    <span className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {question}
                    </span>
                </div>
                <div className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 transition-all duration-300 ml-4 shrink-0",
                    isOpen ? "bg-indigo-600 border-indigo-600 rotate-180" : "bg-slate-50 group-hover:border-indigo-300"
                )}>
                    <ChevronDown className={cn("w-4 h-4 transition-colors", isOpen ? "text-white" : "text-slate-400")} />
                </div>
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-slate-600 leading-relaxed pr-12">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export function UnifiedFAQ() {
    const faqs: FAQItemProps[] = [
        {
            category: "General",
            question: "Is Schologic really free for students?",
            answer: "Yes. Students never pay for Schologic directly. We partner with institutions to provide the platform as infrastructure. For the Universal Reader, we focus on Zero-Textbook-Cost (ZTC) resources to reduce student debt."
        },
        {
            category: "Instuctors",
            question: "Does the AI replace my grading?",
            answer: "No. The AI Teaching Assistant generates draft grades and rubrics based on your criteria. You always have the final say and can edit any feedback before releasing it to students. It's designed to be a 'human-in-the-loop' system."
        },
        {
            category: "Technical",
            question: "Does it work offline?",
            answer: "The 'Portable Schologic' initiative is designed for low-bandwidth environments. While an initial connection is needed to sync content, the Universal Reader caches materials for offline study."
        },
        {
            category: "Integrations",
            question: "We use Canvas/Moodle. Must we switch?",
            answer: "Not entirely. Schologic integrates via LTI 1.3. You can use our specific modules (like the Universal Reader or AI Grader) inside your existing LMS, or adopt the full Schologic platform for a complete experience."
        }
    ];

    return (
        <SectionGrid id="faq" className="bg-slate-50/50">
            <GridColumn span={4}>
                <h2 className="text-3xl font-serif font-black text-slate-900 mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-500 mb-8">
                    Common questions about implementation, pricing, and technology.
                </p>
            </GridColumn>
            <GridColumn span={8}>
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </GridColumn>
        </SectionGrid>
    );
}

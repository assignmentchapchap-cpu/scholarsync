import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export const AITeachingAssistantFAQ = () => {
    return (
        <section className="py-24 bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Common Questions</h2>
                    <p className="text-slate-400">Everything you need to know about automated grading and rubrics.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-slate-800 rounded-lg bg-slate-950/50 px-4">
                        <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                            Can I edit the AI-generated rubric?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-400 leading-relaxed">
                            Yes. The AI generates a draft rubric based on your assignment description, complete with criteria weights and descriptions. You can add, remove, or modify any criterion and adjust point values before publishing the assignment.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-slate-800 rounded-lg bg-slate-950/50 px-4">
                        <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                            Does the AI submit grades automatically?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-400 leading-relaxed">
                            No. Schologic uses a "Human-in-the-Loop" approach. The AI analyzes the submission and calculates a suggested score based on your rubric, but the grade is only recorded after you review and approve it. You can override any score.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-slate-800 rounded-lg bg-slate-950/50 px-4">
                        <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                            How are the AI scores calculated?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-400 leading-relaxed">
                            We use a deterministic multiplier system to prevent "hallucinations." For each rubric criterion, the AI assigns a performance level (e.g., Exceptional = 100%, Good = 60%). The final score is a mathematical sum of these weighted criteria, ensuring potential bias is minimized.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border border-slate-800 rounded-lg bg-slate-950/50 px-4">
                        <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                            Can the Assistant help me find settings in the portal?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-400 leading-relaxed">
                            Yes. The Platform Copilot is trained on Schologic's entire documentation. You can ask it questions like "How do I set a late submission policy?" or "Where do I export grades to PDF?" to get instant, step-by-step navigation help.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            'mainEntity': [
                                {
                                    '@type': 'Question',
                                    'name': 'Can I edit the AI-generated rubric?',
                                    'acceptedAnswer': {
                                        '@type': 'Answer',
                                        'text': 'Yes. The AI generates a draft rubric based on your assignment description, complete with criteria weights and descriptions. You can add, remove, or modify any criterion and adjust point values before publishing the assignment.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    'name': 'Does the AI submit grades automatically?',
                                    'acceptedAnswer': {
                                        '@type': 'Answer',
                                        'text': 'No. Schologic uses a "Human-in-the-Loop" approach. The AI analyzes the submission and calculates a suggested score based on your rubric, but the grade is only recorded after you review and approve it. You can override any score.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    'name': 'How are the AI scores calculated?',
                                    'acceptedAnswer': {
                                        '@type': 'Answer',
                                        'text': 'We use a deterministic multiplier system to prevent "hallucinations." For each rubric criterion, the AI assigns a performance level (e.g., Exceptional = 100%, Good = 60%). The final score is a mathematical sum of these weighted criteria, ensuring potential bias is minimized.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    'name': 'Can the Assistant help me find settings in the portal?',
                                    'acceptedAnswer': {
                                        '@type': 'Answer',
                                        'text': 'Yes. The Platform Copilot is trained on Schologic\'s entire documentation. You can ask it questions like "How do I set a late submission policy?" or "Where do I export grades to PDF?" to get instant, step-by-step navigation help.'
                                    }
                                }
                            ]
                        })
                    }}
                />
            </div>
        </section>
    );
};

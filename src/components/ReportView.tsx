import { AlertTriangle, CheckCircle, Download } from "lucide-react";

interface ReportViewProps {
    score: number;
    reportData: { sentences: any[] };
    readOnly?: boolean;
}

export default function ReportView({ score, reportData, readOnly = false }: ReportViewProps) {
    const isHighRisk = score > 50;

    return (
        <div className="space-y-6">
            {/* Score Header */}
            <div className={`p-6 rounded-xl border ${isHighRisk ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${isHighRisk ? 'border-red-500 text-red-700 bg-white' : 'border-emerald-500 text-emerald-700 bg-white'}`}>
                        {score.toFixed(0)}%
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold ${isHighRisk ? 'text-red-800' : 'text-emerald-800'}`}>
                            {isHighRisk ? 'High Probability of AI Content' : 'Likely Human-Written'}
                        </h2>
                        <p className="text-slate-600 mt-1">
                            {isHighRisk
                                ? 'A significant portion of this text matches patterns found in AI-generated content.'
                                : 'Most sentences appear natural and human-written.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Warning Disclaimer */}
            <div className="flex gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                    <strong>Disclaimer:</strong> This score represents a statistical probability, not a definitive proof of academic misconduct.
                    Please use this report as a starting point for discussion with the student rather than absolute evidence.
                    Citations and formulaic technical writing can sometimes trigger false positives.
                </p>
            </div>

            {/* Document Viewer */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 leading-relaxed text-lg text-slate-800 font-serif">
                {reportData && reportData.sentences ? (
                    reportData.sentences.map((sent, idx) => {
                        // Render sentence with highlight if suspected
                        // Tooltip could be added for exact score
                        const isSuspected = sent.isSuspected;
                        return (
                            <span
                                key={idx}
                                className={`relative group transition-colors duration-200 ${isSuspected ? 'bg-red-100 hover:bg-red-200 cursor-help rounded px-0.5 box-decoration-clone' : ''}`}
                                title={isSuspected ? `AI Probability: ${(sent.score * 100).toFixed(1)}%` : 'Human'}
                            >
                                {sent.sentence}{" "}
                            </span>
                        )
                    })
                ) : (
                    <p className="text-slate-400 italic">No detailed analysis data available.</p>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="flex justify-end gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all">
                    <Download className="w-5 h-5" /> Download Report (PDF)
                </button>
            </div>
        </div>
    );
}

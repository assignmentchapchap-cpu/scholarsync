'use client';

import { useState } from 'react';
import {
    RubricConfig,
    PracticumObservationGuide,
    PracticumReportScoreSheet
} from '@schologic/practicum-core';
import { LogsRubricViewer, SupervisorRubricViewer, ReportRubricViewer } from './RubricViewers';
import { List, Users, FileText, Settings } from 'lucide-react';

interface RubricsManagerProps {
    practicumId: string;
    logsRubric: RubricConfig;
    supervisorRubric: PracticumObservationGuide;
    reportRubric: PracticumReportScoreSheet;
    onUpdate?: () => void;
}

type Tab = 'logs' | 'supervisor' | 'report';

export default function RubricsManager({
    practicumId,
    logsRubric,
    supervisorRubric,
    reportRubric
}: RubricsManagerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('logs');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                >
                    <List className="w-5 h-5" />
                    <div className="text-left">
                        <p>Logs Assessment</p>
                        <p className={`text-xs font-normal opacity-80 ${activeTab === 'logs' ? 'text-emerald-100' : 'text-slate-400'}`}>
                            Daily/Weekly Entries
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('supervisor')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'supervisor'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                >
                    <Users className="w-5 h-5" />
                    <div className="text-left">
                        <p>Supervisor Report</p>
                        <p className={`text-xs font-normal opacity-80 ${activeTab === 'supervisor' ? 'text-emerald-100' : 'text-slate-400'}`}>
                            Field Assessment
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('report')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'report'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    <div className="text-left">
                        <p>Final Report</p>
                        <p className={`text-xs font-normal opacity-80 ${activeTab === 'report' ? 'text-emerald-100' : 'text-slate-400'}`}>
                            Project/Thesis
                        </p>
                    </div>
                </button>

                <div className="pt-4 border-t border-slate-100">
                    <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Configuration</p>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed bg-slate-50 opacity-50">
                        <Settings className="w-5 h-5" />
                        Settings & Weights
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                {activeTab === 'logs' && <LogsRubricViewer rubric={logsRubric} />}
                {activeTab === 'supervisor' && <SupervisorRubricViewer rubric={supervisorRubric} />}
                {activeTab === 'report' && <ReportRubricViewer rubric={reportRubric} />}
            </div>
        </div>
    );
}

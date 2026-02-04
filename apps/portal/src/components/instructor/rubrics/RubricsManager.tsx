'use client';

import { useState } from 'react';
import {
    RubricConfig,
    PracticumObservationGuide,
    PracticumReportScoreSheet
} from '@schologic/practicum-core';
import { LogsRubricViewer, SupervisorRubricViewer, ReportRubricViewer } from './RubricViewers';
import { LogsRubricEditor, SupervisorRubricEditor, ReportRubricEditor } from './RubricEditors';
import { updatePracticumRubric } from '@/app/actions/practicum';
import { List, Users, FileText } from 'lucide-react';

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
    logsRubric: initialLogsRubric,
    supervisorRubric: initialSupervisorRubric,
    reportRubric: initialReportRubric
}: RubricsManagerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('logs');
    const [isEditing, setIsEditing] = useState(false);

    // Local state for rubrics to support editing
    const [logsRubric, setLogsRubric] = useState(initialLogsRubric);
    const [supervisorRubric, setSupervisorRubric] = useState(initialSupervisorRubric);
    const [reportRubric, setReportRubric] = useState(initialReportRubric);

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
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                {activeTab === 'logs' && (
                    isEditing
                        ? <LogsRubricEditor
                            initialRubric={logsRubric}
                            onSave={async (newRubric) => {
                                setLogsRubric(newRubric);
                                setIsEditing(false);
                                try {
                                    const result = await updatePracticumRubric(practicumId, 'logs', newRubric);
                                    if (!result.success) throw new Error(result.error);
                                } catch (err) {
                                    console.error("Failed to save logs rubric", err);
                                    alert("Falied to save changes to server.");
                                }
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                        : <LogsRubricViewer rubric={logsRubric} onEdit={() => setIsEditing(true)} />
                )}

                {activeTab === 'supervisor' && (
                    isEditing
                        ? <SupervisorRubricEditor
                            initialRubric={supervisorRubric}
                            onSave={async (newRubric) => {
                                setSupervisorRubric(newRubric);
                                setIsEditing(false);
                                try {
                                    const result = await updatePracticumRubric(practicumId, 'supervisor', newRubric);
                                    if (!result.success) throw new Error(result.error);
                                } catch (err) {
                                    console.error("Failed to save supervisor rubric", err);
                                    alert("Falied to save changes to server.");
                                }
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                        : <SupervisorRubricViewer rubric={supervisorRubric} onEdit={() => setIsEditing(true)} />
                )}

                {activeTab === 'report' && (
                    isEditing
                        ? <ReportRubricEditor
                            initialRubric={reportRubric}
                            onSave={async (newRubric) => {
                                setReportRubric(newRubric);
                                setIsEditing(false);
                                try {
                                    const result = await updatePracticumRubric(practicumId, 'report', newRubric);
                                    if (!result.success) throw new Error(result.error);
                                } catch (err) {
                                    console.error("Failed to save report rubric", err);
                                    alert("Falied to save changes to server.");
                                }
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                        : <ReportRubricViewer rubric={reportRubric} onEdit={() => setIsEditing(true)} />
                )}
            </div>
        </div>
    );
}

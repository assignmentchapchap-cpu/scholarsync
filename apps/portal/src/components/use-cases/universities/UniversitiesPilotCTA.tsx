'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import InstitutionalPilotModal from '@/components/leads/InstitutionalPilotModal';

export function UniversitiesPilotCTA() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-600/20 flex items-center gap-2"
            >
                Request Institutional Pilot <ArrowRight className="w-5 h-5" />
            </button>

            {showModal && (
                <InstitutionalPilotModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}

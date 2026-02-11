'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import InstitutionalPilotModal from '@/components/leads/InstitutionalPilotModal';

export function CollegesPilotCTA() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-xl shadow-amber-600/20 flex items-center gap-2"
            >
                Launch Your Hybrid Campus <ArrowRight className="w-5 h-5" />
            </button>

            {showModal && (
                <InstitutionalPilotModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}

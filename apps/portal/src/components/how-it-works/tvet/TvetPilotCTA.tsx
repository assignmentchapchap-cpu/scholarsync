'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import InstitutionalPilotModal from '@/components/leads/InstitutionalPilotModal';

export function TvetPilotCTA() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl shadow-emerald-600/20 flex items-center gap-2"
            >
                Launch Your Digital Campus <ArrowRight className="w-5 h-5" />
            </button>

            {showModal && (
                <InstitutionalPilotModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}

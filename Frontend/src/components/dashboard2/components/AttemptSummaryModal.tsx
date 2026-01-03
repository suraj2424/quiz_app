// components/dashboard2/components/AttemptSummaryModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../../UI/Modal';
import type { Attempt } from '../types';
import { AttemptHeader } from './attempt-summary/AttemptHeader';
import { ScoreDisplay } from './attempt-summary/ScoreDisplay';
import { AttemptDetails } from './attempt-summary/AttemptDetails';
import { PerformanceBreakdown } from './attempt-summary/PerformanceBreakdown';
import { InsightsSection } from './attempt-summary/InsightsSection';
import { ActionButtons } from './attempt-summary/ActionButtons';

interface AttemptSummaryModalProps {
    attempt: Attempt | null;
    isOpen: boolean;
    onClose: () => void;
    quizTitle?: string;
}

export default function AttemptSummaryModal({
    attempt,
    isOpen,
    onClose,
    quizTitle
}: AttemptSummaryModalProps) {
    const [isRetaking, setIsRetaking] = useState(false);

    if (!attempt) return null;

    const percentage = (attempt.score / attempt.totalScore) * 100;

    const handleRetake = () => {
        setIsRetaking(true);
        console.log('Retaking quiz:', attempt.attemptId);
        // Additional retake logic can be added here
    };

    if (isRetaking) {
        // Handle retake logic here
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="relative bg-white rounded-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <AttemptHeader
                        quizTitle={quizTitle}
                        percentage={percentage}
                    />

                    <div className="mt-6 space-y-8">
                        <ScoreDisplay
                            attempt={attempt}
                            percentage={percentage}
                        />

                        <AttemptDetails
                            attempt={attempt}
                            percentage={percentage}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <PerformanceBreakdown
                                score={attempt.score}
                                totalScore={attempt.totalScore}
                                percentage={percentage}
                            />

                            <InsightsSection
                                percentage={percentage}
                                timeSpent={attempt.timeSpent}
                            />
                        </div>

                        <ActionButtons
                            onClose={onClose}
                            onRetake={handleRetake}
                            attemptId={attempt.attemptId}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

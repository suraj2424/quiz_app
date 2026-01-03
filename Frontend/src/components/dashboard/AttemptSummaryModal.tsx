import { useState } from 'react';
import Modal from '../UI/Modal';
import type { Attempt } from './types';
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
      <div className="p-6">
        <AttemptHeader 
          quizTitle={quizTitle} 
          percentage={percentage} 
        />

        <ScoreDisplay 
          attempt={attempt} 
          percentage={percentage} 
        />

        <AttemptDetails 
          attempt={attempt} 
          percentage={percentage} 
        />

        <PerformanceBreakdown 
          score={attempt.score}
          totalScore={attempt.totalScore}
          percentage={percentage}
        />

        <InsightsSection 
          percentage={percentage}
          timeSpent={attempt.timeSpent}
        />

        <ActionButtons 
          onClose={onClose}
          onRetake={handleRetake}
          attemptId={attempt.attemptId}
        />
      </div>
    </Modal>
  );
}
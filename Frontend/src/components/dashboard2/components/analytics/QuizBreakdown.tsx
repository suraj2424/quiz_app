import { useState } from 'react';
import QuizStatCard from '../QuizStatCard';
import type { QuizAttempts } from '../../types';

export function QuizBreakdown({
  quizAttempts,
  onQuizSelect
}: {
  quizAttempts: QuizAttempts[];
  onQuizSelect: (quizId: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Performance Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizAttempts.map((quiz) => (
          <QuizStatCard
            key={quiz.quizId}
            quiz={quiz}
            onViewDetails={() => onQuizSelect(quiz.quizId)}
          />
        ))}
      </div>
    </div>
  );
}

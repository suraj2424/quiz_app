// components/dashboard/HistorySection.tsx
import QuizHistoryCard from './QuizHistoryCard';
import type { QuizAttempts, Attempt } from './types';

interface HistorySectionProps {
  quizAttempts: QuizAttempts[];
  onAttemptSelect: (attempt: Attempt) => void;
}

export default function HistorySection({ quizAttempts, onAttemptSelect }: HistorySectionProps) {
  if (quizAttempts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz history yet</h3>
        <p className="text-gray-600">Start taking quizzes to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quiz History</h2>
        <span className="text-sm text-gray-500">{quizAttempts.length} quizzes completed</span>
      </div>
      
      <div className="space-y-4">
        {quizAttempts.map((quiz) => (
          <QuizHistoryCard
            key={quiz.quizId}
            quiz={quiz}
            onAttemptSelect={onAttemptSelect}
          />
        ))}
      </div>
    </div>
  );
}
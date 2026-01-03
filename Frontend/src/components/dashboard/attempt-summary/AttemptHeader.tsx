import type { Attempt } from '../types';
import ScoreIndicator from '../ScoreIndicator';

interface AttemptHeaderProps {
  quizTitle?: string;
  percentage: number;
}

export function AttemptHeader({ quizTitle, percentage }: AttemptHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="w-20 h-20 mx-auto mb-4">
        <ScoreIndicator score={percentage} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Quiz Attempt Summary
      </h2>
      
      {quizTitle && (
        <p className="text-lg text-gray-600">{quizTitle}</p>
      )}
    </div>
  );
}

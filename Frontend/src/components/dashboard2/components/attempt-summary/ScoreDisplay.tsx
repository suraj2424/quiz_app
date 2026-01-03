import { Trophy, Star, ThumbsUp, BookOpen } from 'lucide-react';
import type { Attempt } from '../../types';

interface ScoreDisplayProps {
  attempt: Attempt;
  percentage: number;
}

export function ScoreDisplay({ attempt, percentage }: ScoreDisplayProps) {
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;
  const isPassing = percentage >= 60;

  const getStatusIcon = () => {
    if (isExcellent) return <Trophy className="w-4 h-4 mr-1" />;
    if (isGood) return <Star className="w-4 h-4 mr-1" />;
    if (isPassing) return <ThumbsUp className="w-4 h-4 mr-1" />;
    return <BookOpen className="w-4 h-4 mr-1" />;
  };

  const getStatusText = () => {
    if (isExcellent) return 'Excellent!';
    if (isGood) return 'Great job!';
    if (isPassing) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="text-center">
        <div className={`text-4xl font-bold mb-2 ${isExcellent ? 'text-green-600' :
          isGood ? 'text-blue-600' :
            isPassing ? 'text-yellow-600' :
              'text-red-600'
          }`}>
          {percentage.toFixed(1)}%
        </div>

        <div className="text-lg text-gray-700 mb-2">
          {attempt.score} out of {attempt.totalScore} correct
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isExcellent ? 'bg-green-100 text-green-800' :
          isGood ? 'bg-blue-100 text-blue-800' :
            isPassing ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {getStatusIcon()}
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}

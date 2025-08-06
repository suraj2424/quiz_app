// components/dashboard/QuizSummaryCard.tsx
import { formatTime } from '../../utils/formatTime';
import ScoreIndicator from './ScoreIndicator';
import type { QuizAttempts } from './types';

interface QuizSummaryCardProps {
  quiz: QuizAttempts;
  onClick?: () => void;
}

export default function QuizSummaryCard({ quiz, onClick }: QuizSummaryCardProps) {
  if (!quiz) {
    return null;
  }

  // Use stats directly from API (they're always present in your data)
  const stats = quiz.stats;
  const latestAttempt = quiz.attempts && quiz.attempts.length > 0 
    ? quiz.attempts[quiz.attempts.length - 1] 
    : null;

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-purple-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Quiz Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-semibold text-xs">
                {quiz.quizTitle.charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 truncate">{quiz.quizTitle}</h4>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>Best: {stats.highestScore.toFixed(0)}%</span>
            {stats.totalTimeSpent > 0 && (
              <>
                <span>•</span>
                <span>{formatTime(stats.totalTimeSpent)}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Score Indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreIndicator score={stats.highestScore} />
          {onClick && (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Recent Performance Indicator */}
      {latestAttempt && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last attempt</span>
            <span className={`font-medium ${
              latestAttempt.percentage >= 80 ? 'text-green-600' :
              latestAttempt.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {latestAttempt.percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
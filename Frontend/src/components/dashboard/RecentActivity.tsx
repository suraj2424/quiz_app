// components/dashboard/RecentActivity.tsx

import { formatRelativeTime } from '../../utils/dateUtils';
import { formatTime } from '../../utils/formatTime';
import ScoreIndicator from './ScoreIndicator';
import type { QuizAttempts } from './types';

interface RecentActivityProps {
  quizAttempts: QuizAttempts[];
  maxItems?: number;
}

export default function RecentActivity({ quizAttempts, maxItems = 5 }: RecentActivityProps) {
  // Flatten all attempts and sort by most recent
  const allAttempts = quizAttempts
    .flatMap(quiz => 
      quiz.attempts.map(attempt => ({
        ...attempt,
        quizTitle: quiz.quizTitle,
        quizId: quiz.quizId
      }))
    )
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
    .slice(0, maxItems);

  if (allAttempts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📈</span>
          </div>
          <p className="text-gray-500 text-sm">No recent activity</p>
          <p className="text-gray-400 text-xs mt-1">Start taking quizzes to see your activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs text-gray-500">{allAttempts.length} recent attempts</span>
      </div>
      
      <div className="space-y-4">
        {allAttempts.map((attempt, index) => (
          <RecentActivityItem 
            key={attempt.attemptId} 
            attempt={attempt}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

interface RecentActivityItemProps {
  attempt: {
    attemptId: string;
    score: number;
    totalScore: number;
    timeSpent: number;
    endTime: string;
    quizTitle: string;
    completed: boolean;
  };
  isLatest?: boolean;
}

function RecentActivityItem({ attempt, isLatest = false }: RecentActivityItemProps) {
  const percentage = (attempt.score / attempt.totalScore) * 100;
  
  return (
    <div className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
      isLatest ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
    }`}>
      {isLatest && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Score Indicator */}
      <ScoreIndicator score={percentage} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 truncate text-sm">
            {attempt.quizTitle}
          </h4>
          <span className={`text-xs font-semibold ${
            percentage >= 80 ? 'text-green-600' : 
            percentage >= 60 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            {formatRelativeTime(attempt.endTime)}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(attempt.timeSpent)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                percentage >= 80 ? 'bg-green-500' : 
                percentage >= 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Status Badge */}
      {!attempt.completed && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Incomplete
          </span>
        </div>
      )}
    </div>
  );
}
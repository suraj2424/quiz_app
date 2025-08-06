// components/dashboard/QuizHistoryCard.tsx
import { useState } from 'react';
import ScoreIndicator from './ScoreIndicator';
import { formatTime } from '../../utils/formatTime';
import type { QuizAttempts, Attempt } from './types';

interface QuizHistoryCardProps {
  quiz: QuizAttempts;
  onAttemptSelect: (attempt: Attempt) => void;
}

export default function QuizHistoryCard({ quiz, onAttemptSelect }: QuizHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bestScore = Math.max(...quiz.attempts.map(a => (a.score / a.totalScore) * 100));
  const latestAttempt = quiz.attempts[quiz.attempts.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Quiz Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">
                  {quiz.quizTitle.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{quiz.quizTitle}</h3>
                <p className="text-sm text-gray-500">
                  {quiz.attempts.length} attempt{quiz.attempts.length !== 1 ? 's' : ''} • 
                  Best: {bestScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ScoreIndicator score={bestScore} />
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Attempts List */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4 space-y-2">
            {quiz.attempts.map((attempt) => (
              <button
                key={attempt.attemptId}
                onClick={() => onAttemptSelect(attempt)}
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ScoreIndicator score={(attempt.score / attempt.totalScore) * 100} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {((attempt.score / attempt.totalScore) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(attempt.timeSpent)}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
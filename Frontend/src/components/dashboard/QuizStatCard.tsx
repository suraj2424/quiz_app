// components/dashboard/QuizStatCard.tsx
import { formatDate } from '../../utils/dateUtils';
import { formatTime } from '../../utils/formatTime';
import ScoreIndicator from './ScoreIndicator';
import type { QuizAttempts } from './types';

interface QuizStatCardProps {
  quiz: QuizAttempts;
  onViewDetails?: () => void;
}

export default function QuizStatCard({ quiz, onViewDetails }: QuizStatCardProps) {
  if (!quiz) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Quiz data not available</p>
        </div>
      </div>
    );
  }

  // console.log('Rendering QuizStatCard with quiz:', quiz); // Debug log

  // Use API stats and calculate additional stats
  const apiStats = quiz.stats;
  const additionalStats = calculateAdditionalStats(quiz);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">
                  {quiz.quizTitle.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{quiz.quizTitle}</h3>
                <p className="text-sm text-gray-500">
                  {apiStats.totalAttempts} attempt{apiStats.totalAttempts !== 1 ? 's' : ''} • 
                  Last: {additionalStats.latestAttempt ? formatDate(additionalStats.latestAttempt) : 'Never'}
                </p>
              </div>
            </div>
          </div>
          
          <ScoreIndicator score={apiStats.highestScore} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatItem
            label="Highest Score"
            value={`${apiStats.highestScore.toFixed(1)}%`}
            icon="🏆"
            color="text-yellow-600"
          />
          <StatItem
            label="Average Score"
            value={`${apiStats.averageScore.toFixed(1)}%`}
            icon="📊"
            color="text-blue-600"
          />
          <StatItem
            label="Total Time"
            value={formatTime(apiStats.totalTimeSpent)}
            icon="⏱️"
            color="text-green-600"
          />
          <StatItem
            label="Accuracy"
            value={`${additionalStats.overallAccuracy.toFixed(1)}%`}
            icon="🎯"
            color="text-purple-600"
          />
        </div>

        {/* Progress Visualization */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">
              {additionalStats.totalCorrectAnswers}/{additionalStats.totalQuestions} correct
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(additionalStats.overallAccuracy, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium rounded-lg transition-colors duration-200 text-sm"
          >
            View Detailed Analytics →
          </button>
        )}
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
  color: string;
}

function StatItem({ label, value, icon, color }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function calculateAdditionalStats(quiz: QuizAttempts) {
  if (!quiz.attempts || quiz.attempts.length === 0) {
    return {
      overallAccuracy: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0,
      latestAttempt: null as Date | null
    };
  }

  const totalCorrect = quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = quiz.attempts.reduce((sum, attempt) => sum + attempt.totalScore, 0);
  
  const latestAttemptDate = quiz.attempts.length > 0 
    ? new Date(quiz.attempts[quiz.attempts.length - 1].endTime)
    : null;

  return {
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    totalCorrectAnswers: totalCorrect,
    totalQuestions,
    latestAttempt: latestAttemptDate
  };
}
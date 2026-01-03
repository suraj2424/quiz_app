// components/dashboard2/components/analytics/PerformanceDistribution.tsx
import { BarChart3, Clock } from 'lucide-react';
import type { QuizAttempts } from '../../types';

export function PerformanceDistribution({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  const allScores = quizAttempts.flatMap(quiz =>
    quiz.attempts.map(attempt => (attempt.score / attempt.totalScore) * 100)
  );

  const distribution = {
    'A (90-100%)': { count: allScores.filter(s => s >= 90).length, color: 'bg-green-500' },
    'B (80-89%)': { count: allScores.filter(s => s >= 80 && s < 90).length, color: 'bg-blue-500' },
    'C (70-79%)': { count: allScores.filter(s => s >= 70 && s < 80).length, color: 'bg-yellow-500' },
    'D (60-69%)': { count: allScores.filter(s => s >= 60 && s < 70).length, color: 'bg-orange-500' },
    'F (<60%)': { count: allScores.filter(s => s < 60).length, color: 'bg-red-500' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <BarChart3 className="w-5 h-5 text-purple-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900">Score Distribution</h4>
      </div>

      <div className="space-y-4">
        {Object.entries(distribution).map(([grade, { count, color }]) => {
          const percentage = allScores.length > 0 ? (count / allScores.length) * 100 : 0;
          return (
            <div key={grade}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">{grade}</span>
                <span className="text-sm font-medium text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// This is a placeholder for the actual CategoryPerformanceChart component
export function CategoryPerformanceChart({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  // This would be more useful if you have quiz categories/tags
  // For now, let's simulate time of day distribution based on actual data if available, or keep mock

  const getHour = (dateStr: string) => new Date(dateStr).getHours();

  const attempts = quizAttempts.flatMap(q => q.attempts);
  const total = attempts.length;

  const morning = attempts.filter(a => {
    const h = getHour(a.endTime);
    return h >= 5 && h < 12;
  }).length;

  const afternoon = attempts.filter(a => {
    const h = getHour(a.endTime);
    return h >= 12 && h < 17;
  }).length;

  const evening = attempts.filter(a => {
    const h = getHour(a.endTime);
    return h >= 17 || h < 5;
  }).length;

  const timeDistribution = {
    'Morning (5AM-12PM)': { count: morning, color: 'bg-amber-400' },
    'Afternoon (12PM-5PM)': { count: afternoon, color: 'bg-orange-400' },
    'Evening (5PM-5AM)': { count: evening, color: 'bg-indigo-400' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900">Study Time Distribution</h4>
      </div>

      <div className="space-y-4">
        {Object.entries(timeDistribution).map(([time, { count, color }]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={time}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">{time}</span>
                <span className="text-sm font-medium text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

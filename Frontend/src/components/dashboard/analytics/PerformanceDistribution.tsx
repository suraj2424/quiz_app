import type { QuizAttempts } from '../types';

export function PerformanceDistribution({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  const allScores = quizAttempts.flatMap(quiz => 
    quiz.attempts.map(attempt => (attempt.score / attempt.totalScore) * 100)
  );

  const distribution = {
    'A (90-100%)': allScores.filter(s => s >= 90).length,
    'B (80-89%)': allScores.filter(s => s >= 80 && s < 90).length,
    'C (70-79%)': allScores.filter(s => s >= 70 && s < 80).length,
    'D (60-69%)': allScores.filter(s => s >= 60 && s < 70).length,
    'F (<60%)': allScores.filter(s => s < 60).length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h4>
      <div className="space-y-3">
        {Object.entries(distribution).map(([grade, count]) => {
          const percentage = allScores.length > 0 ? (count / allScores.length) * 100 : 0;
          return (
            <div key={grade} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{grade}</span>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
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
  const timeDistribution = {
    'Morning': 35,
    'Afternoon': 45,
    'Evening': 20,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Study Time Distribution</h4>
      <div className="space-y-3">
        {Object.entries(timeDistribution).map(([time, percentage]) => (
          <div key={time} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{time}</span>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">{percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

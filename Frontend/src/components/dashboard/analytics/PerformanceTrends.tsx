import type { QuizAttempts } from '../types';
import PerformanceChart from './PerformanceChart';

export function PerformanceTrends({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
      <PerformanceChart quizAttempts={quizAttempts} />
    </div>
  );
}

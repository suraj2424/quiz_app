// components/dashboard2/components/analytics/PerformanceTrends.tsx
import type { QuizAttempts } from '../../types';
import PerformanceChart from '../PerformanceChart';

export function PerformanceTrends({ quizAttempts }: { quizAttempts: QuizAttempts[] }) {
  // PerformanceChart now has its own container and styling, so we just render it directly
  // We can wrap it if we want to add specific margins or additional context for the analytics page
  return (
    <div className="space-y-4">
      <PerformanceChart quizAttempts={quizAttempts} />
    </div>
  );
}

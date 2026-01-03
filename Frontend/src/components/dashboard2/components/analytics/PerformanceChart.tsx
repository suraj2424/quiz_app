import type { QuizAttempts } from '../../types';

interface PerformanceChartProps {
  quizAttempts: QuizAttempts[];
}

export default function PerformanceChart({ quizAttempts }: PerformanceChartProps) {
  // This is a placeholder for the actual chart implementation
  // You can integrate with a charting library like Recharts or Chart.js here

  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500">Performance chart will be displayed here</p>
    </div>
  );
}

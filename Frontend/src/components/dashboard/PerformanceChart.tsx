import { LineChart } from '../charts/Charts';
import type { QuizAttempts } from './types';

interface PerformanceChartProps {
  quizAttempts: QuizAttempts[];
}

export default function PerformanceChart({ quizAttempts }: PerformanceChartProps) {
  const chartData = quizAttempts.flatMap((quiz) =>
    quiz.attempts.map((attempt) => ({
      date: new Date(attempt.endTime).toLocaleDateString(),
      score: (attempt.score / attempt.totalScore) * 100,
    }))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
          <p className="text-sm text-gray-600">Track your progress across all quizzes</p>
        </div>
      </div>
      
      <div className="h-64">
        <LineChart
          data={chartData}
          customOptions={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  callback: (value) => `${value}%`,
                }
              },
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
    </div>
  );
}
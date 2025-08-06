// components/dashboard/OverviewSection.tsx
import QuickStatCard from './QuickStatCard';  // ← This is for the stats cards
import PerformanceChart from './PerformanceChart';
import RecentActivity from './RecentActivity';
import QuizSummaryCard from './QuizSummaryCard';  // ← This is for individual quiz cards
import { formatTime } from '../../utils/formatTime';
import type { QuizAttempts, AnalyticsData } from './types';

interface OverviewSectionProps {
  quizAttempts: QuizAttempts[];
  analyticsData: AnalyticsData | null;
}

export default function OverviewSection({ quizAttempts, analyticsData }: OverviewSectionProps) {
  const stats = [
    {
      title: 'Average Score',
      value: `${(analyticsData?.averageScore || 0).toFixed(1)}%`,
      icon: '🎯',
      trend: analyticsData?.scoresTrend,
      color: 'purple' as const
    },
    {
      title: 'Total Attempts',
      value: analyticsData?.totalAttempts || 0,
      icon: '📝',
      trend: analyticsData?.attemptsTrend,
      color: 'blue' as const
    },
    {
      title: 'Time Studied',
      value: formatTime(analyticsData?.totalTimeSpent || 0),
      icon: '⏰',
      trend: analyticsData?.timeTrend,
      color: 'green' as const
    },
    {
      title: 'Completion Rate',
      value: `${(analyticsData?.completionRate || 0).toFixed(1)}%`,
      icon: '✅',
      trend: analyticsData?.completionTrend,
      color: 'orange' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats - Using QuickStatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <QuickStatCard key={index} {...stat} />
        ))}
      </div>

      {/* Performance Chart and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceChart quizAttempts={quizAttempts} />
        </div>
        <div>
          <RecentActivity quizAttempts={quizAttempts} />
        </div>
      </div>

      {/* Quiz Summary Section - Using QuizSummaryCard (Optional) */}
      {quizAttempts && quizAttempts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Quizzes</h3>
            <span className="text-sm text-gray-500">{quizAttempts.length} quiz{quizAttempts.length !== 1 ? 'zes' : ''}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizAttempts.slice(0, 6).map((quiz) => (
              <QuizSummaryCard 
                key={quiz.quizId} 
                quiz={quiz}
                onClick={() => {
                  console.log('Navigate to quiz:', quiz.quizId);
                }}
              />
            ))}
          </div>
          
          {quizAttempts.length > 6 && (
            <div className="text-center mt-4">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View all quizzes →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import { ReactNode } from 'react';
import { BookOpen, Target, Star, Clock } from 'lucide-react';
import { formatTime } from '../../../../utils/formatTime';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

interface PerformanceMetricsProps {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  totalTimeSpent: number;
}

export function PerformanceMetrics({
  totalQuizzes,
  totalAttempts,
  averageScore,
  totalTimeSpent
}: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Quizzes"
        value={totalQuizzes}
        icon={<BookOpen className="w-6 h-6" />}
        color="blue"
      />
      <MetricCard
        title="Total Attempts"
        value={totalAttempts}
        icon={<Target className="w-6 h-6" />}
        color="green"
      />
      <MetricCard
        title="Average Score"
        value={`${averageScore.toFixed(1)}%`}
        icon={<Star className="w-6 h-6" />}
        color="yellow"
      />
      <MetricCard
        title="Study Time"
        value={formatTime(totalTimeSpent)}
        icon={<Clock className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
}

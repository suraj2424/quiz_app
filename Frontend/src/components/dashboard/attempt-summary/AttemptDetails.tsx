import type { Attempt } from '../types';
import { formatDateTime } from '../../../utils/dateUtils';
import { formatTime } from '../../../utils/formatTime';

interface DetailCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
}

function DetailCard({ icon, title, value, subtitle }: DetailCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

interface AttemptDetailsProps {
  attempt: Attempt;
  percentage: number;
}

export function AttemptDetails({ attempt, percentage }: AttemptDetailsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <DetailCard
        icon="📅"
        title="Date & Time"
        value={formatDateTime(attempt.startTime)}
        subtitle="Started"
      />
      
      <DetailCard
        icon="⏱️"
        title="Time Taken"
        value={formatTime(attempt.timeSpent)}
        subtitle="Total duration"
      />
      
      <DetailCard
        icon="🎯"
        title="Accuracy"
        value={`${percentage.toFixed(1)}%`}
        subtitle="Overall score"
      />
      
      <DetailCard
        icon="✅"
        title="Status"
        value={attempt.completed ? "Completed" : "Incomplete"}
        subtitle={attempt.completed ? "Successfully finished" : "Not finished"}
      />
    </div>
  );
}

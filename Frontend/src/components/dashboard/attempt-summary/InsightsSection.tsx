import { formatTime } from '../../../utils/formatTime';

interface InsightsSectionProps {
  percentage: number;
  timeSpent: number;
}

export function InsightsSection({ percentage, timeSpent }: InsightsSectionProps) {
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;
  const isPassing = percentage >= 60;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 className="font-medium text-blue-900 mb-2">💡 Insights</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        {isExcellent && <li>Outstanding performance! You've mastered this topic.</li>}
        {isGood && !isExcellent && <li>Great work! You have a solid understanding of the material.</li>}
        {isPassing && !isGood && <li>Good effort! Review the topics you missed to improve further.</li>}
        {!isPassing && <li>Keep practicing! Consider reviewing the material before trying again.</li>}
        <li>Time taken: {formatTime(timeSpent)} - {
          timeSpent < 300 ? 'Quick completion!' :
          timeSpent < 900 ? 'Good pacing.' :
          'Take your time to think through each question.'
        }</li>
      </ul>
    </div>
  );
}

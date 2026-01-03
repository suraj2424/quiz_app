interface PerformanceBreakdownProps {
  score: number;
  totalScore: number;
  percentage: number;
}

export function PerformanceBreakdown({ score, totalScore, percentage }: PerformanceBreakdownProps) {
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;
  const isPassing = percentage >= 60;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Correct Answers</span>
          <span className="font-medium text-green-600">{score}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Incorrect Answers</span>
          <span className="font-medium text-red-600">{totalScore - score}</span>
        </div>
        
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-gray-600 font-medium">Total Questions</span>
          <span className="font-medium text-gray-900">{totalScore}</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isExcellent ? 'bg-green-500' :
              isGood ? 'bg-blue-500' :
              isPassing ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

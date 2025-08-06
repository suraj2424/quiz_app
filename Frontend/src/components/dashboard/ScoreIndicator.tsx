// components/dashboard/ScoreIndicator.tsx (Fixed)
interface ScoreIndicatorProps {
  score: number;
}

export default function ScoreIndicator({ score }: ScoreIndicatorProps) {
  // Handle undefined/null/NaN scores
  const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  
  const getIndicator = (score: number) => {
    if (score >= 90) return { color: 'text-green-600', bg: 'bg-green-100', icon: '🏆' };
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-100', icon: '⭐' };
    if (score >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '👍' };
    if (score >= 60) return { color: 'text-orange-600', bg: 'bg-orange-100', icon: '📈' };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: '📚' };
  };

  const indicator = getIndicator(validScore);

  return (
    <div className={`w-8 h-8 rounded-full ${indicator.bg} flex items-center justify-center`}>
      <span className="text-sm">{indicator.icon}</span>
    </div>
  );
}
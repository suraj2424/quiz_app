// components/dashboard/TrendIndicator.tsx
interface TrendIndicatorProps {
  value: number;
}

export default function TrendIndicator({ value }: TrendIndicatorProps) {
  if (value === 0) {
    return (
      <span className="flex items-center text-xs text-gray-500">
        <span className="mr-1">→</span>
        0%
      </span>
    );
  }

  const isPositive = value > 0;
  
  return (
    <span className={`flex items-center text-xs ${
      isPositive ? 'text-green-600' : 'text-red-600'
    }`}>
      <span className="mr-1">{isPositive ? '↑' : '↓'}</span>
      {Math.abs(value)}%
    </span>
  );
}
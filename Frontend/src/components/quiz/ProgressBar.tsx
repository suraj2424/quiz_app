interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`fixed bottom-0 left-64 right-0 h-1 bg-gray-200 ${className}`}>
      <div
        className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
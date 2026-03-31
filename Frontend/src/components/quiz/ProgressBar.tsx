export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-[100]">
      <div
        className="bg-indigo-600 h-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
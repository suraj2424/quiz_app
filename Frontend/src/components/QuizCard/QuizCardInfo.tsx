// components/QuizCard/QuizCardInfo.tsx
interface QuizCardInfoProps {
  questionCount: number;
  estimatedTime: number;
}

export default function QuizCardInfo({ questionCount, estimatedTime }: QuizCardInfoProps) {
  return (
    <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.75-6.172-2.172M12 3v18" />
        </svg>
        <span className="text-sm text-gray-600">
          {questionCount} Question{questionCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-gray-600">
          ~{estimatedTime} min
        </span>
      </div>
    </div>
  );
}
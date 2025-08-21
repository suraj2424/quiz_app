// components/QuizCard/QuizCardInfo.tsx
interface QuizCardInfoProps {
  questionCount: number;
  estimatedTime: number;
}

export default function QuizCardInfo({ questionCount, estimatedTime }: QuizCardInfoProps) {
  return (
    <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100">
      <div className="flex items-center gap-2">
        {/* Clipboard Document List (questions) - Heroicons outline */}
        <svg
          className="w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13.5h6m-6-3h6m-1.5-6H9.75A2.25 2.25 0 007.5 6.75v10.5A2.25 2.25 0 009.75 19.5h4.5A2.25 2.25 0 0016.5 17.25V6.75A2.25 2.25 0 0014.25 4.5zm0 0V3.75A1.5 1.5 0 0012.75 2.25h-1.5A1.5 1.5 0 009.75 3.75V4.5"
          />
        </svg>
        <span className="text-sm text-gray-600">
          {questionCount} Question{questionCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Clock - Heroicons outline */}
        <svg
          className="w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
        <span className="text-sm text-gray-600">
          ~{estimatedTime} min
        </span>
      </div>
    </div>
  );
}
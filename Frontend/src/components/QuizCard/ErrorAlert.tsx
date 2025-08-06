// components/QuizCard/ErrorAlert.tsx
interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
  isVisible: boolean;
}

export default function ErrorAlert({ error, onClose, isVisible }: ErrorAlertProps) {
  if (!isVisible || !error) return null;

  return (
    <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-700">{error}</span>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors duration-200 ml-3"
          aria-label="Close error"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
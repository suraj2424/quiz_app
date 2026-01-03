// components/QuizCard/ErrorAlert.tsx
import { AlertCircle, X } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
  isVisible: boolean;
}

export default function ErrorAlert({ error, onClose, isVisible }: ErrorAlertProps) {
  if (!isVisible || !error) return null;

  return (
    <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-xl shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Error Icon */}
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          
          {/* Error Content */}
          <div className="pt-1">
            <p className="text-xs font-medium text-red-800 mb-0.5">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 transition-all duration-200 flex-shrink-0"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
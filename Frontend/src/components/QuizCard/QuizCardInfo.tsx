// components/QuizCard/QuizCardInfo.tsx
import { ClipboardList, Clock } from "lucide-react";

interface QuizCardInfoProps {
  questionCount: number;
  estimatedTime: number;
}

export default function QuizCardInfo({ questionCount, estimatedTime }: QuizCardInfoProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* Questions Count */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
          <ClipboardList className="w-4 h-4 text-purple-600" />
        </div>
        <div className="pr-1">
          <p className="text-sm font-semibold text-gray-900">
            {questionCount}
          </p>
          <p className="text-xs text-gray-500">
            Question{questionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      {/* Estimated Time */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
          <Clock className="w-4 h-4 text-purple-600" />
        </div>
        <div className="pr-1">
          <p className="text-sm font-semibold text-gray-900">
            {estimatedTime} min
          </p>
          <p className="text-xs text-gray-500">
            Duration
          </p>
        </div>
      </div>
    </div>
  );
}
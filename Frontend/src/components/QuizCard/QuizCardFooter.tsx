// components/QuizCard/QuizCardFooter.tsx
import { User, Play } from "lucide-react";
import LoadingButton from "../UI/LoadingButton";

interface QuizCardFooterProps {
  createdBy: {
    name?: string;
  };
  onStartQuiz: () => void;
  isLoading: boolean;
}

export default function QuizCardFooter({ createdBy, onStartQuiz, isLoading }: QuizCardFooterProps) {
  const creatorInitial = createdBy.name?.[0]?.toUpperCase();
  
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      {/* Creator Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20">
            {creatorInitial ? (
              <span className="text-white text-sm font-semibold">
                {creatorInitial}
              </span>
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Created by</p>
          <p className="text-sm font-semibold text-gray-800">
            {createdBy.name || 'Anonymous'}
          </p>
        </div>
      </div>
      
      {/* Start Button */}
      <LoadingButton
        onClick={onStartQuiz}
        loading={isLoading}
        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 hover:-translate-y-0.5"
      >
        <Play className="w-4 h-4" fill="currentColor" />
        <span>Start Quiz</span>
      </LoadingButton>
    </div>
  );
}
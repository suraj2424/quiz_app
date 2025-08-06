import LoadingButton from "../UI/LoadingButton";

interface QuizCardFooterProps {
  createdBy: {
    name?: string;
  };
  onStartQuiz: () => void;
  isLoading: boolean;
}

export default function QuizCardFooter({ createdBy, onStartQuiz, isLoading }: QuizCardFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      {/* Creator Info */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {createdBy.name?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Created by</p>
          <p className="text-sm font-medium text-gray-700">
            {createdBy.name || 'Unknown'}
          </p>
        </div>
      </div>
      
      {/* Start Button */}
      <LoadingButton
        onClick={onStartQuiz}
        loading={isLoading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Start Quiz
      </LoadingButton>
    </div>
  );
}
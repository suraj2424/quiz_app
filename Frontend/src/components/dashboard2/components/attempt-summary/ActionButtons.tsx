import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  onClose: () => void;
  onRetake: () => void;
  attemptId: string;
}

export function ActionButtons({ onClose, onRetake, attemptId }: ActionButtonsProps) {
  const navigate = useNavigate();

  const handleRetake = () => {
    onRetake();
    // Additional retake logic can be added here
  };

  const handleViewDetails = () => {
    navigate(`/attempt/${attemptId}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Close
      </button>
      
      <button
        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
        onClick={handleRetake}
      >
        Retake Quiz
      </button>
      
      <button
        className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors duration-200"
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </div>
  );
}

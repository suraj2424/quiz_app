import { formatTime, getDifficultyColor } from '../../utils/quizHelpers';
import TimerAnimation from '../TimerAnimation'; // Assuming this exists
import Button from '../UI/Button';

interface QuizHeaderProps {
  title: string;
  difficulty: string;
  timeLimit: number;
  timeElapsed: number;
  onExit: () => void;
}

export default function QuizHeader({ 
  title, 
  difficulty, 
  timeLimit, 
  timeElapsed, 
  onExit 
}: QuizHeaderProps) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm h-16 fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {formatTime(timeLimit - timeElapsed)}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Exit
          </Button>
        </div>
      </div>
    </header>
  );
}
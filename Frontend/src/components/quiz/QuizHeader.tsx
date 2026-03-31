interface QuizHeaderProps {
  title: string;
  difficulty: string;
  timeLimit: number;
  timeElapsed: number;
  onExit: () => void;
}
import { formatTime } from '../../utils/quizHelpers';
// import TimerAnimation from '../TimerAnimation'; // Assuming this exists
// import Button from '../UI/Button';


export default function QuizHeader({ 
  title, 
  timeLimit, 
  timeElapsed, 
  onExit 
}: QuizHeaderProps) {
  return (
    <header className="w-full bg-white border-b-4 border-black h-20 fixed top-0 left-0 z-50 px-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="bg-amber-400 border-2 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-black uppercase tracking-tighter">Live Session</span>
        </div>
        <h1 className="text-2xl font-black italic uppercase tracking-tight text-black">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Timer Box */}
        <div className="flex items-center gap-3 bg-teal-400 border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono text-xl font-black">
            {formatTime(timeLimit - timeElapsed)}
          </span>
        </div>

        <button 
          onClick={onExit}
          className="bg-rose-500 border-2 border-black px-4 py-2 text-white font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Quit Exam
        </button>
      </div>
    </header>
  );
}
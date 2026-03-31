import { useQuizSystem } from "../QuizContext";
import Button from "../../UI/Button";
import ThemeToggle from "../../common/ThemeToggle"; // Adjusted path to your existing component

interface QuizHeaderProps {
  title: string;
  timeLimit: number;
}

export default function QuizHeader({
  title,
  timeLimit,
}: QuizHeaderProps) {
  const { state, dispatch } = useQuizSystem();

  const totalSecondsLimit = timeLimit * 60;
  const remaining = Math.max(0, totalSecondsLimit - state.elapsedSeconds);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your answers for this attempt will be lost.",
      )
    ) {
      dispatch({ type: "RESET" });
    }
  };

  return (
    <header className="h-20 bg-white dark:bg-zinc-900 border-b-4 border-black dark:border-white fixed top-0 w-full z-50 px-6 flex items-center justify-between transition-colors">
      {/* Left: Quiz Info */}
      <div className="flex items-center gap-4">
        <div className="bg-teal-400 text-black px-3 py-1 font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Quiz in progress
        </div>
        <h1 className="text-lg md:text-xl font-black uppercase truncate max-w-[150px] md:max-w-none dark:text-white">
          {title}
        </h1>
      </div>

      {/* Right: Controls & Timer */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Your existing Theme Toggle */}
        <ThemeToggle />

        {timeLimit > 0 ? (
          <div
            className={`flex flex-col items-end min-w-[80px] ${remaining < 60 ? "text-rose-600 animate-pulse" : "text-black dark:text-white"}`}
          >
            <span className="text-[10px] font-bold uppercase opacity-60 leading-none">
              Time Left
            </span>
            <span className="text-2xl font-black leading-none tabular-nums">
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-end text-black dark:text-white">
            <span className="text-[10px] font-bold uppercase opacity-60">
              No time limit
            </span>
            <span className="text-2xl font-black italic">--:--</span>
          </div>
        )}

        {/* Simple Exit Action */}
        <Button
          variant="outline"
          onClick={handleExit}
          className="hidden md:block border-2 border-black dark:border-white text-xs py-2 px-4 h-auto font-bold hover:bg-rose-50 dark:hover:bg-rose-900/30"
        >
          EXIT QUIZ
        </Button>
      </div>
    </header>
  );
}

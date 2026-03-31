import Button from "../../UI/Button";
import { useQuizSystem } from "../QuizContext";
import { Quiz } from "../types";

interface QuizWelcomeProps {
  quiz: Quiz;
}

export default function QuizWelcome({ quiz }: QuizWelcomeProps) {
  const { dispatch } = useQuizSystem();

  const handleStartClick = () => {
    dispatch({ type: "START_QUIZ" });
  };

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-400 dark:bg-zinc-900 flex items-center justify-center p-6 font-mono transition-colors">
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 border-[6px] border-black dark:border-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_rgba(255,255,255,0.2)] p-10">
        <div className="mb-8">
          <div className="inline-block bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold uppercase">
            Difficulty: {quiz.difficulty}
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-tight mt-4 tracking-tighter dark:text-white">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="mt-4 font-bold text-gray-600 dark:text-gray-400 text-sm">
              {quiz.description}
            </p>
          )}
        </div>

        <div className="space-y-6 mb-10 border-l-8 border-black dark:border-white pl-6 py-4">
          <p className="text-xl font-bold leading-tight dark:text-white">
            Ready to start? Your timer begins as soon as you click the
            button.
          </p>

          <div className="flex gap-8 text-sm font-black uppercase opacity-70 dark:text-gray-300">
            <span>Questions: {quiz.questions?.length || quiz.noOfQuestions}</span>
            <span>
              {quiz.timeLimit > 0
                ? `Time: ${quiz.timeLimit} minutes`
                : "No time limit"}
            </span>
          </div>
        </div>

        <Button
          onClick={handleStartClick}
          className="w-full text-2xl py-6 bg-teal-400 hover:bg-teal-300 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-black"
        >
          Start quiz
        </Button>

        <div className="mt-6 flex justify-center items-center gap-2 opacity-40 dark:text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Created by {quiz.createdBy?.name || "Quiz Team"}
          </span>
        </div>
      </div>
    </div>
  );
}

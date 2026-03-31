import { ClipboardList, Clock, FileText, Play } from "lucide-react";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useQuizAuth } from "../../hooks/useQuizAuth";
import AuthDialog from "./AuthDialog";

interface Quiz {
  _id: string;

  title: string;

  difficulty: string;

  tags: string[];

  questionCount: number;

  createdBy: {
    name?: string;
  };
}

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("token");

  const { isLoading, handleStartQuiz: startProcess } = useQuizAuth();

  const handleStart = async () => {
    const status = await startProcess(token, quiz._id);
    if (status === "AUTH_REQUIRED") setShowAuthDialog(true);
    else if (status === true) navigate(`/quiz/id=${quiz._id}`);
  };

  return (
    <>
      <div className="group bg-white dark:bg-[#1a1a2e] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(20,184,166,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col h-full">
        {/* Difficulty Top Bar */}
        <div
          className={`h-3 border-b-[3px] border-black ${
            quiz.difficulty === "beginner"
              ? "bg-teal-400"
              : quiz.difficulty === "intermediate"
                ? "bg-amber-400"
                : "bg-rose-500"
          }`}
        />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex gap-4 mb-4">
            {/* File Icon Box */}
            <div className="w-14 h-14 bg-black dark:bg-teal-500 flex items-center justify-center shrink-0 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(20,184,166,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-8 h-8 text-white dark:text-black" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black uppercase text-xl leading-none group-hover:text-teal-600 dark:group-hover:text-teal-400 dark:text-white transition-colors">
                {quiz.title}
              </h3>
              <div className="flex gap-1 flex-wrap">
                {quiz.tags.slice(0, 3).map((t: string) => (
                  <span
                    key={t}
                    className="text-[10px] font-black uppercase px-1.5 py-0.5 border-[1.5px] border-black bg-white dark:bg-black dark:text-white"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="p-2 border-[2px] border-black bg-gray-50 dark:bg-[#0D0221] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="font-black text-xs uppercase dark:text-white">
                {quiz.questionCount} Q's
              </span>
            </div>
            <div className="p-2 border-[2px] border-black bg-gray-50 dark:bg-[#0D0221] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-black text-xs uppercase dark:text-white">
                {Math.ceil(quiz.questionCount * 1.5)} MIN
              </span>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-auto pt-4 border-t-[3px] border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 border-[2px] border-black flex items-center justify-center font-black text-white text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {quiz.createdBy.name?.[0] || "A"}
              </div>
              <span className="text-xs font-black uppercase italic text-gray-700 dark:text-gray-400">
                {quiz.createdBy.name || "ANON"}
              </span>
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 border-[2px] border-black hover:bg-teal-500 dark:hover:bg-teal-400 hover:text-black transition-all font-black uppercase text-xs flex items-center gap-2 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(20,184,166,1)] hover:shadow-none"
            >
              {isLoading ? (
                "..."
              ) : (
                <>
                  <Play className="w-3 h-3" fill="currentColor" /> GO
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        quizId={quiz._id}
      />
    </>
  );
}

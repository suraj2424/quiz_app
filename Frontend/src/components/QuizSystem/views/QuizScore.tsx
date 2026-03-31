import Button from "../../UI/Button";
import { useQuizSystem } from "../QuizContext";
import { countCorrectAnswers, totalQuizPoints } from "../quizUtils";
import { Quiz } from "../types";

interface QuizScoreProps {
  quiz: Quiz;
}

export default function QuizScore({ quiz }: QuizScoreProps) {
  const { state, dispatch } = useQuizSystem();

  const totalQuestions = quiz.questions?.length || 0;
  const correctAnswers = countCorrectAnswers(quiz.questions, state.answers);
  const totalPoints = totalQuizPoints(quiz.questions);
  const accuracy =
    totalPoints > 0 ? Math.round((state.score / totalPoints) * 100) : 0;

  return (
    <div className="min-h-screen bg-teal-400 flex items-center justify-center p-6 font-mono">
      <div className="max-w-2xl w-full bg-white border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] p-10">
        <div className="text-center mb-10">
          <div className="inline-block bg-black text-white px-4 py-1 text-sm font-black uppercase italic mb-4">
            Quiz complete
          </div>
          <h1 className="text-7xl font-black italic uppercase leading-none tracking-tighter">
            {accuracy}%
          </h1>
          <p className="font-black uppercase text-xl mt-2 tracking-widest">
            Overall score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="border-4 border-black p-4 bg-gray-50">
            <p className="text-[10px] font-black uppercase opacity-50">
              Correct answers
            </p>
            <p className="text-2xl font-black">
              {correctAnswers} / {totalQuestions}
            </p>
          </div>
          <div className="border-4 border-black p-4 bg-gray-50">
            <p className="text-[10px] font-black uppercase opacity-50">
              Points
            </p>
            <p className="text-2xl font-black">
              {state.score} / {totalPoints}
            </p>
          </div>
          <div className="border-4 border-black p-4 bg-gray-50">
            <p className="text-[10px] font-black uppercase opacity-50">
              Time taken
            </p>
            <p className="text-2xl font-black">
              {Math.floor(state.elapsedSeconds / 60)}m{" "}
              {state.elapsedSeconds % 60}s
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-black text-white text-xl py-5"
            onClick={() => dispatch({ type: "START_REVIEW" })}
          >
            Review answers
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-4 py-4 font-black"
              onClick={() => dispatch({ type: "RESET" })}
            >
              Try again
            </Button>
            <Button
              variant="outline"
              className="border-4 py-4 font-black bg-amber-400"
              onClick={() => window.location.assign("/")}
            >
              Exit quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

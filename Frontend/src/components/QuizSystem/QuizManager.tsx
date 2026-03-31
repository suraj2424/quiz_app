import { useEffect } from "react";
import { useQuizSystem } from "./QuizContext";
import { calculateQuizScore } from "./quizUtils";
import QuizWelcome from "./views/QuizWelcome";
import QuizSession from "./views/QuizSession";
import QuizScore from "./views/QuizScore";
import QuizReview from "./views/QuizReview";
import SyncingLoader from "./views/SyncingLoader";
import { Quiz } from "./types";

interface QuizManagerProps {
  quiz: Quiz;
}

export default function QuizManager({ quiz }: QuizManagerProps) {
  const { state, dispatch } = useQuizSystem();

  useEffect(() => {
    if (state.status !== "IN_PROGRESS" || quiz.timeLimit <= 0) {
      return;
    }

    if (state.elapsedSeconds >= quiz.timeLimit * 60) {
      dispatch({ type: "SUBMIT_ATTEMPT" });
    }
  }, [dispatch, quiz.timeLimit, state.elapsedSeconds, state.status]);

  useEffect(() => {
    if (state.status !== "SUBMITTING") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      try {
        const score = calculateQuizScore(quiz.questions, state.answers);
        dispatch({ type: "SUBMIT_SUCCESS", score });
      } catch {
        dispatch({
          type: "SUBMIT_ERROR",
          error: "We could not calculate your results. Please try again.",
        });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, quiz.questions, state.answers, state.status]);

  if (!quiz) {
    return null;
  }

  switch (state.status) {
    case "WELCOME":
      return <QuizWelcome quiz={quiz} />;
    case "IN_PROGRESS":
      return (
        <QuizSession
          questions={quiz.questions}
          title={quiz.title}
          timeLimit={quiz.timeLimit}
        />
      );
    case "SUBMITTING":
      return (
        <SyncingLoader
          title="Checking your answers"
          message="Please wait while we prepare your results."
        />
      );
    case "COMPLETED":
      return <QuizScore quiz={quiz} />;
    case "REVIEWING":
      return <QuizReview quiz={quiz} />;
    case "ERROR":
      return (
        <div className="min-h-screen bg-rose-100 flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase">Something went wrong</h2>
            <p className="mt-4 font-bold text-zinc-700">
              {state.error ?? "Please refresh the page and try again."}
            </p>
          </div>
        </div>
      );
    default:
      return <QuizWelcome quiz={quiz} />;
  }
}

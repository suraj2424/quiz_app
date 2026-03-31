import Button from "../../UI/Button";
import { useQuizSystem } from "../QuizContext";
import { isAnswerCorrect } from "../quizUtils";
import { Quiz, Question, QuestionOption } from "../types";

interface QuizReviewProps {
  quiz: Quiz;
}

export default function QuizReview({ quiz }: QuizReviewProps) {
  const { state, dispatch } = useQuizSystem();

  return (
    <div className="min-h-screen bg-white font-mono">
      <div className="h-16 border-b-4 border-black bg-white sticky top-0 z-50 flex items-center justify-between px-6">
        <span className="font-black uppercase italic tracking-tighter text-xl">
          Review answers
        </span>
        <Button
          variant="outline"
          className="h-10 text-xs border-2"
          onClick={() => dispatch({ type: "SHOW_RESULTS" })}
        >
          Back to results
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-12 py-12">
        {quiz.questions.map((question: Question, idx: number) => {
          const userAnswer = state.answers[idx];
          const isCorrect = isAnswerCorrect(question, userAnswer);

          return (
            <div
              key={idx}
              className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div
                className={`p-3 border-b-4 border-black flex justify-between font-black italic uppercase text-sm ${
                  isCorrect ? "bg-teal-400" : "bg-rose-500 text-white"
                }`}
              >
                <span>Question {idx + 1}</span>
                <span>{isCorrect ? "Correct" : "Incorrect"}</span>
              </div>

              <div className="p-6 bg-white">
                <h3 className="text-2xl font-black uppercase italic mb-6 leading-tight">
                  {question.questionText}
                </h3>

                <div className="grid gap-3 mb-6">
                  {question.options.map((option: QuestionOption, oIdx: number) => {
                    const isUserChoice = userAnswer === oIdx;
                    const isRight = isAnswerCorrect(question, oIdx);

                    let bg = "bg-white";
                    if (isRight) bg = "bg-teal-100 border-teal-600";
                    if (isUserChoice && !isRight) bg = "bg-rose-100 border-rose-600";

                    return (
                      <div
                        key={oIdx}
                        className={`p-4 border-2 border-black font-bold flex items-center gap-4 ${bg}`}
                      >
                        <div
                          className={`w-6 h-6 border-2 border-black flex items-center justify-center text-xs ${
                            isUserChoice ? "bg-black text-white" : "bg-white"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="flex-1">{option.optionText}</span>
                        {isRight && (
                          <span className="text-teal-600 font-black">
                            Correct answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-amber-100 border-l-8 border-amber-400 p-4 text-sm italic font-bold">
                  <span className="block text-[10px] uppercase opacity-50 not-italic mb-1">
                    Explanation
                  </span>
                  {question.answerExplanation ||
                    "No explanation was provided for this question."}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-black text-white"
            onClick={() => dispatch({ type: "SHOW_RESULTS" })}
          >
            Back to results
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-2"
            onClick={() => dispatch({ type: "RESET" })}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Question, AnsweredQuestion } from '../../utils/quizTypes';
import QuestionCard from './QuestionCard';
import Button from '../UI/Button';

interface QuizContentProps {
  questions: Question[];
  currentQuestion: number;
  selectedAnswer: number | string | null;
  shortAnswer: string;
  answeredQuestions: AnsweredQuestion[];
  showHint: boolean;
  onAnswerSelect: (index: number) => void;
  onShortAnswerChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onHintClick: () => void;
  on5050Click: () => void;
}

export default function QuizContent({
  questions,
  currentQuestion,
  selectedAnswer,
  shortAnswer,
  answeredQuestions,
  showHint,
  onAnswerSelect,
  onShortAnswerChange,
  onPrevious,
  onNext,
  onSubmit,
  onHintClick,
  on5050Click
}: QuizContentProps) {
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canGoNext = questions[currentQuestion].questionType === "Short Answer" 
    ? shortAnswer.trim() !== ""
    : selectedAnswer !== null;

  return (
    <main className="flex-1 ml-64 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-4xl mx-auto pt-4">
        <QuestionCard
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          shortAnswer={shortAnswer}
          onAnswerSelect={onAnswerSelect}
          onShortAnswerChange={onShortAnswerChange}
          showHint={showHint}
          onHintClick={onHintClick}
          on5050Click={on5050Click}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="secondary"
            onClick={onPrevious}
            disabled={currentQuestion === 0}
            className="disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-purple-200">
            <span className="text-sm text-gray-600">Progress:</span>
            <span className="font-semibold text-purple-700">
              {answeredQuestions.length} / {questions.length}
            </span>
          </div>

          <Button
            onClick={isLastQuestion ? onSubmit : onNext}
            disabled={!canGoNext}
            className="disabled:opacity-50"
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </main>
  );
}
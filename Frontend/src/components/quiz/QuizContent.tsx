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
  onAnswerSelect,
  onShortAnswerChange,
  onPrevious,
  onNext,
  onSubmit,
}: QuizContentProps) {
  const currentQData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  
  const isAnswered = currentQData.questionType === "Short Answer" 
    ? shortAnswer.trim().length > 0 
    : selectedAnswer !== null;

  return (
    <main className="flex-1 bg-teal-50/20 min-h-screen p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress System: Hard-Coded Brutalist Style */}
        <div className="mb-10 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black uppercase italic tracking-widest">
              Task Execution: {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-100 border-2 border-black h-4 overflow-hidden">
            <div 
              className="bg-teal-400 border-r-2 border-black h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* The Main Stage */}
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12">
          <QuestionCard
            question={currentQData}
            selectedAnswer={selectedAnswer}
            shortAnswer={shortAnswer}
            onAnswerSelect={onAnswerSelect}
            onShortAnswerChange={onShortAnswerChange}
          />

          <div className="flex justify-between mt-12 pt-10 border-t-4 border-black">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentQuestion === 0}
              className="px-6"
            >
              ← Back
            </Button>

            {isLastQuestion ? (
              <Button 
                variant="secondary"
                onClick={onSubmit} 
                disabled={!isAnswered}
                className="bg-rose-500 shadow-rose-200"
              >
                Submit Attempt
              </Button>
            ) : (
              <Button 
                variant="primary"
                onClick={onNext} 
                disabled={!isAnswered}
              >
                Save & Continue →
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
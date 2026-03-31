import Button from '../../UI/Button';
import { useQuizSystem } from '../QuizContext';
import { Question } from '../types';

interface QuizContentProps {
  questions: Question[];
}

export default function QuizContent({ questions }: QuizContentProps) {
  const { state, dispatch } = useQuizSystem();
  const currentQuestion = questions[state.currentQuestionIndex];
  const selectedAnswer = state.answers[state.currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  const handleSelect = (val: string | number) => {
    dispatch({ type: 'SET_ANSWER', questionIndex: state.currentQuestionIndex, answer: val });
  };

  return (
    <div className="font-mono">
      {/* Question Text */}
      <div className="mb-12">
        <span className="text-xs font-black uppercase italic opacity-50 block mb-2">
          Question {state.currentQuestionIndex + 1} of {questions.length}
        </span>
        <h2 className="text-3xl md:text-4xl font-black uppercase italic leading-tight border-l-8 border-black pl-6">
          {currentQuestion.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-12">
        {currentQuestion.options.map((option, idx: number) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full p-5 text-left border-4 border-black font-black uppercase italic transition-all flex items-center gap-4 ${
              selectedAnswer === idx 
              ? 'bg-teal-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' 
              : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
            }`}
          >
            <span className={`w-8 h-8 border-2 border-black flex items-center justify-center bg-white text-black font-black not-italic ${selectedAnswer === idx ? 'bg-black text-white' : ''}`}>
              {String.fromCharCode(65 + idx)}
            </span>
            {option.optionText}
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-8 border-t-4 border-black">
        <Button 
          disabled={state.currentQuestionIndex === 0}
          onClick={() => dispatch({ type: 'GO_TO_QUESTION', index: state.currentQuestionIndex - 1 })}
          variant="outline"
          className="flex-1 border-2"
        >
          Previous
        </Button>
        <Button 
          onClick={() => {
            if (state.currentQuestionIndex === questions.length - 1) {
              dispatch({ type: 'SUBMIT_ATTEMPT' });
            } else {
              dispatch({ type: 'GO_TO_QUESTION', index: state.currentQuestionIndex + 1 });
            }
          }}
          className="flex-1 bg-black text-white"
        >
          {state.currentQuestionIndex === questions.length - 1 ? 'Submit quiz' : 'Next question'}
        </Button>
      </div>
    </div>
  );
}

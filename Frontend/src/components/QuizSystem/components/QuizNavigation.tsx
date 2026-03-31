import { useQuizSystem } from '../QuizContext';
import { Question } from '../types';

interface QuizNavigationProps {
  questions: Question[];
}

export default function QuizNavigation({ questions }: QuizNavigationProps) {
  const { state, dispatch } = useQuizSystem();
  const answeredCount = Object.keys(state.answers).length;

  return (
    <div className="p-6 font-mono">
      <h2 className="text-xs font-black uppercase tracking-widest mb-6 opacity-50 italic">
        Questions
      </h2>
      
      <div className="grid grid-cols-4 gap-3">
        {questions.map((_, idx) => {
          const isCurrent = state.currentQuestionIndex === idx;
          const isAnswered = state.answers[idx] !== undefined;

          let btnClass = "border-2 border-black h-12 flex items-center justify-center font-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
          
          if (isCurrent) {
            btnClass = "bg-black text-white border-2 border-black h-12 flex items-center justify-center font-black scale-110 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]";
          } else if (isAnswered) {
            btnClass = "bg-teal-400 border-2 border-black h-12 flex items-center justify-center font-black hover:bg-teal-300";
          } else {
            btnClass = "bg-white border-2 border-black h-12 flex items-center justify-center font-black hover:bg-gray-100";
          }

          return (
            <button
              key={idx}
              onClick={() => dispatch({ type: 'GO_TO_QUESTION', index: idx })}
              className={btnClass}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-10 p-4 border-2 border-black bg-gray-50 text-[10px] font-black uppercase italic space-y-2">
        <div>{answeredCount} of {questions.length} answered</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-400 border border-black" /> <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black border border-black" /> <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border border-black" /> <span>Not answered</span>
        </div>
      </div>
    </div>
  );
}

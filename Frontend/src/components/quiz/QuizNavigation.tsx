import { Question, AnsweredQuestion } from '../../utils/quizTypes';

interface QuizNavigationProps {
  questions: Question[];
  currentQuestion: number;
  answeredQuestions: AnsweredQuestion[];
  onQuestionSelect: (index: number) => void;
}
export default function QuizNavigation({ 
  questions, 
  currentQuestion, 
  answeredQuestions, 
  onQuestionSelect 
}: QuizNavigationProps) {
  const isAnswered = (index: number) => answeredQuestions.some(q => q.questionIndex === index);

  return (
    <nav className="hidden lg:block w-80 bg-teal-50 border-r-4 border-black h-[calc(100vh-5rem)] fixed left-0 top-20 overflow-y-auto p-6">
      <h3 className="text-xl font-black uppercase italic mb-8 border-b-4 border-black pb-2">
        Task Index
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {questions.map((_, index) => {
          const active = currentQuestion === index;
          const done = isAnswered(index);

          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`
                aspect-square border-4 border-black font-black text-xl flex items-center justify-center transition-all
                ${active 
                  ? 'bg-amber-400 translate-x-1 translate-y-1 shadow-none' 
                  : done 
                  ? 'bg-teal-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-teal-300' 
                  : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-3 font-bold uppercase text-xs">
          <div className="w-4 h-4 border-2 border-black bg-amber-400" /> Current
        </div>
        <div className="flex items-center gap-3 font-bold uppercase text-xs">
          <div className="w-4 h-4 border-2 border-black bg-teal-400" /> Completed
        </div>
      </div>
    </nav>
  );
}
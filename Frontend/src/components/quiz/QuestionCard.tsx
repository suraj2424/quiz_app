import { Question } from '../../utils/quizTypes';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | string | null;
  shortAnswer: string;
  onAnswerSelect: (index: number) => void;
  onShortAnswerChange: (value: string) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  shortAnswer,
  onAnswerSelect,
  onShortAnswerChange,
}: QuestionCardProps) {
  return (
    <div className="space-y-10">
      {/* Header: Points & Type */}
      <section>
        <div className="flex gap-3 mb-6">
          <span className="bg-black text-white text-[10px] font-black uppercase italic px-3 py-1 border-2 border-black">
            Value: {question.points} Pts
          </span>
          <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {question.questionType}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase italic leading-tight text-black tracking-tight">
          {question.questionText}
        </h2>
      </section>

      {/* Input Section */}
      <section>
        {question.questionType === "Short Answer" ? (
          <div className="relative">
            <textarea
              value={shortAnswer}
              onChange={(e) => onShortAnswerChange(e.target.value)}
              placeholder="// Enter your logic here..."
              className="w-full min-h-[250px] p-6 bg-white border-4 border-black font-mono text-lg font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-gray-300"
            />
            <div className="absolute -bottom-4 -right-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase">
              Chars: {shortAnswer.length}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  className={`group flex items-center p-6 border-4 border-black transition-all text-left ${
                    isSelected
                      ? 'bg-teal-400 translate-x-1 translate-y-1 shadow-none'
                      : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-teal-50 hover:-translate-y-1'
                  }`}
                >
                  <div className={`w-10 h-10 border-4 border-black flex items-center justify-center font-black text-xl mr-6 transition-colors ${
                    isSelected ? 'bg-black text-white' : 'bg-white text-black group-hover:bg-amber-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-xl font-black uppercase italic">
                    {option.optionText}
                  </span>
                  {isSelected && (
                    <div className="ml-4 w-6 h-6 bg-black flex items-center justify-center">
                       <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                         <path d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
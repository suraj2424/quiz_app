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
  const isAnswered = (index: number) => {
    return answeredQuestions.some(q => q.questionIndex === index);
  };

  return (
    <nav className="w-64 bg-white/80 backdrop-blur-lg border-r border-purple-100 h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
        </div>
        
        {/* Progress Summary */}
        <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Progress</div>
          <div className="text-lg font-bold text-purple-700">
            {answeredQuestions.length} / {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-2">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 border-2 ${
                currentQuestion === index
                  ? 'bg-purple-100 border-purple-300 shadow-md'
                  : isAnswered(index)
                  ? 'bg-green-50 border-green-200 hover:bg-green-100'
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm ${
                  currentQuestion === index
                    ? 'bg-purple-600 text-white'
                    : isAnswered(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isAnswered(index) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    Question {index + 1}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {question.questionText.substring(0, 25)}...
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
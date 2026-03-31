import { Quiz, AnsweredQuestion } from '../../utils/quizTypes';
import Button from '../UI/Button';

interface QuizReviewProps {
  quiz: Quiz;
  score: number;
  answeredQuestions: AnsweredQuestion[];
  onBackToScore: () => void;
  onTryAgain: () => void;
  onBackToHome: () => void;
}

export default function QuizReview({
  quiz,
  score,
  answeredQuestions,
  onBackToScore,
  onTryAgain,
  onBackToHome
}: QuizReviewProps) {
  const totalScore = quiz.questions.reduce((total, q) => total + q.points, 0);
  const correctCount = answeredQuestions.filter(q => q.isCorrect).length;

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header - Fixed & Bold */}
      <header className="h-20 bg-white border-b-4 border-black sticky top-0 z-50 px-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBackToScore}
          className="text-xs py-2"
        >
          ← EXIT_REVIEW
        </Button>

        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          LOG_REVIEW: <span className="text-teal-500">{quiz.title}</span>
        </h1>

        <div className="hidden md:block bg-black text-white px-4 py-1 font-black text-xs italic">
          STABILITY: {Math.round((correctCount / quiz.questions.length) * 100)}%
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-12 bg-teal-50/20">
          <div className="max-w-4xl mx-auto space-y-12">
            {quiz.questions.map((question, qIndex) => {
              const userAnswer = answeredQuestions.find(q => q.questionIndex === qIndex);
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div 
                  key={qIndex} 
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                  {/* Question Banner */}
                  <div className={`p-4 border-b-4 border-black flex justify-between items-center ${isCorrect ? 'bg-teal-400' : 'bg-rose-500 text-white'}`}>
                    <span className="font-black uppercase italic text-sm">
                      ENTRY_00{qIndex + 1} // {isCorrect ? 'SUCCESS' : 'FAILURE'}
                    </span>
                    <span className="font-black text-xs border-2 border-black bg-white text-black px-2 py-1">
                      {userAnswer?.points || 0} / {question.points} PTS
                    </span>
                  </div>

                  <div className="p-6 lg:p-8">
                    <h3 className="text-2xl font-black uppercase italic mb-8 leading-tight">
                      {question.questionText}
                    </h3>

                    {/* Answer Logic Blocks */}
                    <div className="space-y-4 mb-8">
                      {question.questionType === "Short Answer" ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border-4 border-black p-4 bg-gray-50">
                            <p className="text-[10px] font-black uppercase opacity-50 mb-2">User_Input:</p>
                            <p className="font-bold italic">{userAnswer?.answerIndex || "NULL"}</p>
                          </div>
                          <div className="border-4 border-black p-4 bg-teal-50">
                            <p className="text-[10px] font-black uppercase text-teal-600 mb-2">Expected_Output:</p>
                            <p className="font-bold italic">{(question as any).correctAnswer || "SYSTEM_DEFINED"}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {question.options.map((option, oIndex) => {
                            const isUserChoice = userAnswer?.answerIndex === oIndex;
                            const isRight = option.isCorrect;
                            
                            let stateClass = "bg-white";
                            if (isRight) stateClass = "bg-teal-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
                            else if (isUserChoice && !isRight) stateClass = "bg-rose-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

                            return (
                              <div key={oIndex} className={`flex items-center p-4 border-2 border-black font-bold uppercase italic text-sm transition-all ${stateClass}`}>
                                <span className="w-8 h-8 border-2 border-black flex items-center justify-center mr-4 bg-white text-black font-black">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <span className="flex-1">{option.optionText}</span>
                                {isRight && <span className="ml-2 font-black">✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Explanation Block */}
                    <div className="bg-amber-400 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="text-xs font-black uppercase mb-2 underline">Analysis_Report:</h4>
                      <p className="text-sm font-bold leading-relaxed tracking-tight">
                        {question.answerExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Sidebar - Metric Summary */}
        <aside className="w-full lg:w-96 bg-white border-l-4 border-black p-10 space-y-10">
          <div>
            <h2 className="text-xl font-black uppercase italic mb-6 underline decoration-teal-400 decoration-8">Summary_Metrics</h2>
            
            <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center mb-8">
              <p className="text-[10px] font-black uppercase opacity-50">Stability_Index</p>
              <p className="text-6xl font-black italic">{Math.round((correctCount / quiz.questions.length) * 100)}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-black uppercase">Success</p>
                <p className="text-2xl font-black italic">{correctCount}</p>
              </div>
              <div className="bg-rose-500 border-4 border-black p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-black uppercase text-rose-200">Failure</p>
                <p className="text-2xl font-black italic">{quiz.questions.length - correctCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-10 border-t-4 border-black">
            <Button className="w-full text-lg py-5" onClick={onTryAgain}>
              RE-INITIALIZE
            </Button>
            <Button variant="secondary" className="w-full bg-amber-400 text-lg py-5" onClick={onBackToHome}>
              CLOSE_INTERFACE
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
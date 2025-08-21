import { Quiz, AnsweredQuestion } from '../../utils/quizTypes';
// import { formatTime } from '../../utils/quizHelpers';
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
  const accuracy = Math.round((score / totalScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
  {/* Header */}
  <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm p-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Button variant="outline" onClick={onBackToScore}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Score
      </Button>

      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Review: {quiz.title}
      </h1>

      <div className="w-28" /> {/* Spacer */}
    </div>
  </header>

  <div className="flex">
    {/* Main Content */}
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {quiz.questions.map((question, qIndex) => {
          const userAnswer = answeredQuestions.find(q => q.questionIndex === qIndex);

          return (
            <div key={qIndex} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-6">
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  userAnswer?.isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {qIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {question.questionText}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userAnswer?.isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {userAnswer?.points || 0} / {question.points} points
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-4">
                {question.questionType === "Short Answer" ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                      <p className="font-medium text-gray-800">
                        {userAnswer?.answerIndex || "Not answered"}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 mb-1">Correct Answer:</p>
                      <p className="font-medium text-green-800">
                        {(question as any).correctAnswer || question.options?.[0]?.optionText || 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={`p-3 rounded-lg border-2 ${
                        option.isCorrect
                          ? 'bg-green-50 border-green-300 text-green-800'
                          : userAnswer?.answerIndex === oIndex
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold text-sm ${
                          option.isCorrect
                            ? 'bg-green-500 text-white'
                            : userAnswer?.answerIndex === oIndex
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="flex-1">{option.optionText}</span>
                        {option.isCorrect && (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {userAnswer?.answerIndex === oIndex && !option.isCorrect && (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Explanation */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {question.answerExplanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Sidebar */}
    <div className="w-80 sticky top-0 h-screen bg-white/80 backdrop-blur-lg border-l border-purple-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Summary</h2>

      {/* Score Circle - Using question-based accuracy */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-purple-600"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: `${2 * Math.PI * 42}`,
              strokeDashoffset: `${2 * Math.PI * 42 * (1 - answeredQuestions.filter(q => q.isCorrect).length / quiz.questions.length)}`
            }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-2xl font-bold text-purple-600">
            {answeredQuestions.filter(q => q.isCorrect).length}
          </span>
          <span className="text-gray-500 text-sm block">/{quiz.questions.length}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Accuracy</p>
          <p className="text-xl font-bold text-purple-700">
            {Math.round((answeredQuestions.filter(q => q.isCorrect).length / quiz.questions.length) * 100)}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-green-600 mb-1">Correct</p>
            <p className="text-lg font-bold text-green-700">
              {answeredQuestions.filter(q => q.isCorrect).length}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-xs text-red-600 mb-1">Incorrect</p>
            <p className="text-lg font-bold text-red-700">
              {answeredQuestions.filter(q => !q.isCorrect).length}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full" onClick={onTryAgain}>
          Try Again
        </Button>
        <Button variant="secondary" className="w-full" onClick={onBackToHome}>
          Back to Home
        </Button>
      </div>
    </div>
  </div>
</div>

  );
}
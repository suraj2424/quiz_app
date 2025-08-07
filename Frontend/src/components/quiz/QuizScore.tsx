import { Quiz, AnsweredQuestion } from '../../utils/quizTypes';
import { formatTime, getPerformanceMessage } from '../../utils/quizHelpers';
import Button from '../UI/Button';

interface QuizScoreProps {
  quiz: Quiz;
  score: number;
  timeElapsed: number;
  answeredQuestions: AnsweredQuestion[];
  onTryAgain: () => void;
  onReview: () => void;
  onBackToHome: () => void;
}

export default function QuizScore({
  quiz,
  score,
  timeElapsed,
  answeredQuestions,
  onTryAgain,
  onReview,
  onBackToHome
}: QuizScoreProps) {
  const totalScore = quiz.questions.reduce((total, q) => total + q.points, 0);
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const totalQuestions = quiz.questions.length;

  // Use question-based accuracy for consistency
  const questionAccuracy = Math.round((correctAnswers / totalQuestions) * 100);
  // Points-based accuracy for detailed scoring
  const pointsAccuracy = Math.round((score / totalScore) * 100);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Quiz Completed
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h1>
          <p className="text-gray-600">
            You've completed "{quiz.title}". Here's how you performed:
          </p>
        </div>

        {/* Score Circle - Using question-based accuracy */}
        <div className="relative w-48 h-48 mx-auto mb-8">
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
                strokeDashoffset: `${2 * Math.PI * 42 * (1 - correctAnswers / totalQuestions)}`,
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-4xl font-bold text-purple-600">{correctAnswers}</span>
            <span className="text-gray-500 text-lg block">/{totalQuestions}</span>
            <span className="text-sm text-gray-500">questions</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-purple-700">{questionAccuracy}%</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-blue-700">{formatTime(timeElapsed)}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Correct</p>
            <p className="text-2xl font-bold text-green-700">{correctAnswers}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <p className="text-sm text-red-600 font-medium mb-1">Incorrect</p>
            <p className="text-2xl font-bold text-red-700">{totalQuestions - correctAnswers}</p>
          </div>
        </div>

        {/* Performance Message - Use question-based accuracy */}
        <div className="text-center mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <p className="text-lg text-gray-700 font-medium">
            {getPerformanceMessage(correctAnswers, totalQuestions)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onTryAgain} className="flex-1 sm:flex-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </Button>

          <Button variant="outline" onClick={onReview} className="flex-1 sm:flex-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Review Answers
          </Button>

          <Button variant="secondary" onClick={onBackToHome} className="flex-1 sm:flex-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Quiz } from '../../utils/quizTypes';
import InfoCard from './InfoCard';
import Button from '../UI/Button';

interface QuizWelcomeProps {
  quiz: Quiz;
  onStartQuiz: () => void;
}

export default function QuizWelcome({ quiz, onStartQuiz }: QuizWelcomeProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.02)_25%,rgba(168,85,247,0.02)_50%,transparent_50%,transparent_75%,rgba(168,85,247,0.02)_75%)] bg-[length:60px_60px]" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-sm font-medium">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Quiz Ready
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {quiz.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {quiz.description}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Difficulty"
              value={quiz.difficulty}
              theme={
                quiz.difficulty === "EASY" ? "success" :
                quiz.difficulty === "MEDIUM" ? "warning" : "danger"
              }
            />

            <InfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Time Limit"
              value={`${quiz.timeLimit / 60} minutes`}
              theme="primary"
            />

            <InfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="Questions"
              value={quiz.noOfQuestions.toString()}
              theme="secondary"
            />
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Instructions:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Read each question carefully before selecting your answer
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                You can navigate between questions using the sidebar
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Use hints wisely - they're limited per question
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Submit your quiz before time runs out
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              onClick={onStartQuiz}
              className="transform hover:scale-105"
            >
              Start Quiz
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Quiz } from '../../utils/quizTypes';
// import InfoCard from './InfoCard';
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';

interface QuizWelcomeProps {
  quiz: Quiz;
  onStartQuiz: () => void;
}

export default function QuizWelcome({ quiz, onStartQuiz }: QuizWelcomeProps) {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-teal-50 p-6 md:p-12 font-sans selection:bg-rose-400">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 border-4 border-black bg-white px-4 py-2 font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          ← Back to Terminal
        </button>

        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* Header Section */}
          <div className="mb-10">
            <div className="inline-block bg-rose-500 text-white border-2 border-black px-4 py-1 font-black uppercase text-xs tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Module: {quiz.difficulty}
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-6">
              {quiz.title}
            </h1>
            <p className="text-xl font-bold border-l-8 border-black pl-6 py-2 bg-amber-50">
              {quiz.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatBox label="Time Limit" value={`${quiz.timeLimit / 60} MINS`} color="bg-teal-400" />
            <StatBox label="Questions" value={quiz.noOfQuestions} color="bg-amber-400" />
            <StatBox label="Status" value="Verified" color="bg-white" />
          </div>

          {/* Protocol Checklist */}
          <div className="border-4 border-black bg-white p-6 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase mb-4 italic underline decoration-rose-500 decoration-4">
              Execution Protocol:
            </h3>
            <ul className="space-y-3 font-bold text-lg">
              <li className="flex gap-3">
                <span className="text-rose-500">▶</span> Timer is final; no manual overrides.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500">▶</span> Browser refreshes may invalidate session.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500">▶</span> Submit before the countdown hits 00:00.
              </li>
            </ul>
          </div>

          <Button 
            variant="primary" 
            onClick={onStartQuiz}
            className="w-full text-2xl py-6"
          >
            Initialize Session
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value, color }: { label: string, value: any, color: string }) {
  return (
    <div className={`${color} border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
      <p className="text-xs font-black uppercase opacity-60 mb-1">{label}</p>
      <p className="text-2xl font-black uppercase italic">{value}</p>
    </div>
  );
}
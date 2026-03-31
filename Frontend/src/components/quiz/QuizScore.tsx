import ActionButton from '../UI/ActionButton';
import Button from '../UI/Button';
import { Quiz, AnsweredQuestion } from '../../utils/quizTypes';

interface QuizScoreProps {
  quiz: Quiz;
  score: number;
  timeElapsed: number;
  answeredQuestions: AnsweredQuestion[];
  onReview: () => void;
  onGoToDashboard: () => void;
  onTryAgain: () => void;
  onBackToHome: () => void;
}

export default function QuizScore({
  quiz, 
  score, 
  timeElapsed, 
  answeredQuestions, 
  ...actions 
}: QuizScoreProps) {
  const totalPossible = quiz.questions.reduce((acc, q) => acc + q.points, 0);
  const percentage = Math.round((score / totalPossible) * 100);

  const getTier = (p: number) => {
    if (p >= 90) return { label: 'ELITE_RANK', color: 'bg-teal-400' };
    if (p >= 70) return { label: 'PRO_RANK', color: 'bg-amber-400' };
    return { label: 'CORE_RANK', color: 'bg-rose-400 text-white' };
  };

  const tier = getTier(percentage);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-3 bg-white border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Left Column: Result Summary */}
        <div className="md:col-span-1 border-r-4 border-black p-10 bg-white flex flex-col justify-center text-center md:text-left">
          <div className={`inline-block self-center md:self-start px-3 py-1 border-2 border-black font-black uppercase text-xs mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${tier.color}`}>
            {tier.label}
          </div>
          
          <div className="mb-10">
            <h2 className="text-[8rem] font-black leading-none italic uppercase tracking-tighter text-black">
              {percentage}<span className="text-4xl not-italic">%</span>
            </h2>
          </div>
          
          <div className="space-y-2">
             <StatRow label="RAW_SCORE" value={`${score}/${totalPossible}`} />
             <StatRow label="TIME_LOG" value={formatTime(timeElapsed)} />
             <StatRow label="ACCURACY" value={`${Math.round((answeredQuestions.filter(a => a.isCorrect).length / quiz.questions.length) * 100)}%`} />
          </div>
        </div>

        {/* Right Column: Content & Actions */}
        <div className="md:col-span-2 p-10 bg-teal-50/30 flex flex-col justify-between">
          <div>
            <h3 className="text-4xl font-black uppercase italic mb-6 border-b-4 border-black pb-4">
              Session Report: {quiz.title}
            </h3>
            <p className="text-xl font-bold border-l-8 border-black pl-6 py-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Your data has been successfully pushed to the persistent layer. 
              Efficiency levels are within target parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
            <ActionButton icon="review" label="Review Script" onClick={actions.onReview} />
            <ActionButton icon="dashboard" label="Analytics Dashboard" onClick={actions.onGoToDashboard} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t-4 border-black">
            <Button 
                onClick={actions.onTryAgain} 
                variant="outline" 
                className="flex-1 text-lg"
            >
                Retry Module
            </Button>
            <Button 
                onClick={actions.onBackToHome} 
                variant="secondary"
                className="flex-1 text-lg bg-rose-500"
            >
                Terminate Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-3 border-b-2 border-black last:border-0">
    <span className="text-black font-black uppercase text-xs italic opacity-60">{label}</span>
    <span className="text-black font-black text-xl italic">{value}</span>
  </div>
);
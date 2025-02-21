import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { Cookies } from 'react-cookie';

interface Attempt {
  attemptId: string;
  // Add other properties as needed
}


interface AttemptSummaryModalProps {

  attempt: Attempt | null;

  quizTitle: string;

  isOpen: boolean;

  onClose: () => void;

}

interface QuestionSummary {
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  explanation: string;
}

interface AttemptSummary {
  attemptId: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  questions: QuestionSummary[];
  statistics: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracy: number;
  };
}

export const AttemptSummaryModal = ({ 
  attempt,
  onClose,
  isOpen 
}: AttemptSummaryModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!isOpen || !attempt?.attemptId) return;
      
      setLoading(true);
      setError(null);
      try {
        const token = cookies.get('token');
        const response = await fetch(`http://localhost:5000/api/attempts/${attempt.attemptId}/summary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const responseData = await response.json();
        
        if (!responseData.success) {
          throw new Error(responseData.error || 'Failed to load summary');
        }
  
        setSummary(responseData.data);
      } catch (err) {
        setError('Failed to load attempt summary');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSummary();
  }, [attempt?.attemptId, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      onClick={e => e.stopPropagation()}
      className="bg-gray-900/90 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-2xl 
                 max-h-[90vh] overflow-y-auto backdrop-blur-lg text-white modal-scroll"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-purple-500/20 sticky top-0 
                      bg-gray-900/90 backdrop-blur-lg z-10 ">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Journey Summary
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-purple-500/20 rounded-full transition-colors duration-300"
        >
          <IoClose size={20} className="text-gray-300 hover:text-white" />
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500/20 border-t-purple-500" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : summary && (
          <div className="grid gap-6">
            {/* Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20"
            >
              <h3 className="font-bold text-lg mb-4 text-purple-300">{summary.quizTitle}</h3>
              <div className="grid grid-cols-2 gap-6">
                <StatItem label="Score" value={`${summary.score}/${summary.totalScore}`} icon="🎯" />
                <StatItem label="Accuracy" value={`${summary.statistics.accuracy.toFixed(1)}%`} icon="📊" />
                <StatItem 
                  label="Time Spent" 
                  value={`${Math.floor(summary.timeSpent / 60)}m ${summary.timeSpent % 60}s`} 
                  icon="⏱️" 
                />
                <StatItem label="Questions" value={summary.statistics.totalQuestions} icon="❓" />
              </div>
            </motion.div>

            {/* Questions List */}
            <div className="space-y-4">
              {summary.questions.map((question, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className={`p-6 rounded-xl border transition-colors duration-300
                    ${question.isCorrect 
                      ? 'border-green-500/30 bg-green-900/20' 
                      : 'border-red-500/30 bg-red-900/20'
                    }`}
                >
                  <p className="font-medium mb-3 text-lg">
                    {idx + 1}. {question.questionText}
                  </p>
                  <div className="space-y-2 text-sm">
                    <ResponseItem 
                      label="Your Answer" 
                      value={question.userAnswer}
                      isCorrect={question.isCorrect}
                    />
                    <ResponseItem 
                      label="Correct Answer" 
                      value={question.correctAnswer}
                      highlight={true}
                    />
                    <div className="flex items-center space-x-2 text-purple-300">
                      <span>Points:</span>
                      <span className="font-semibold">
                        {question.earnedPoints}/{question.points}
                      </span>
                    </div>
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg text-gray-300">
                        <p className="font-medium text-purple-300 mb-1">Explanation:</p>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
</AnimatePresence>
  );
};

const StatItem = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <div className="flex items-center space-x-3">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
);

const ResponseItem = ({ 
  label, 
  value, 
  isCorrect, 
  highlight 
}: { 
  label: string; 
  value: string; 
  isCorrect?: boolean; 
  highlight?: boolean;
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-gray-400">{label}:</span>
    <span className={`font-medium ${
      highlight ? 'text-purple-400' :
      isCorrect === true ? 'text-green-400' :
      isCorrect === false ? 'text-red-400' :
      'text-white'
    }`}>
      {value}
    </span>
  </div>
);
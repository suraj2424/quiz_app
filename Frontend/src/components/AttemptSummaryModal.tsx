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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-semibold">Attempt Summary</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : summary && (
              <div className="grid gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{summary.quizTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Score: {summary.score}/{summary.totalScore}</div>
                    <div>Accuracy: {summary.statistics.accuracy.toFixed(1)}%</div>
                    <div>Time Spent: {Math.floor(summary.timeSpent / 60)}m {summary.timeSpent % 60}s</div>
                    <div>Questions: {summary.statistics.totalQuestions}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {summary.questions.map((question, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${question.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <p className="font-medium mb-2">{idx + 1}. {question.questionText}</p>
                      <div className="text-sm space-y-1">
                        <p>Your Answer: {question.userAnswer}</p>
                        <p>Correct Answer: {question.correctAnswer}</p>
                        <p>Points: {question.earnedPoints}/{question.points}</p>
                        <p className="text-gray-600 mt-2">{question.explanation}</p>
                      </div>
                    </div>
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
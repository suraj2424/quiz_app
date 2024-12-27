import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";
import { CiClock1 } from "react-icons/ci";
import { Check, Target } from "lucide-react";
import {AttemptSummaryModal} from "./AttemptSummaryModal";

interface Attempt {
  attemptId: string;
  score: number;
  totalScore: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  completed: boolean;
}

interface QuizAttempts {
  quizId: string;
  quizTitle: string;
  attempts: Attempt[];
  stats?: {
    totalAttempts: number;
    highestScore: number;
    averageScore: number;
    overallAccuracy: number;
    totalTimeSpent: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    latestAttempt: Date | null;
  };
}

export default function Dashboard() {
  const [cookies] = useCookies(["token"]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    fetchQuizAttempts();
  }, []);

  const fetchQuizAttempts = async () => {
    try {
      const token = cookies.token;
      const response = await fetch(
        "http://localhost:5000/api/attempts/user/quizzes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attempts");
      }

      const data = await response.json();

      // Validate and sanitize the data
      // const sanitizedData = data.map((quiz: QuizAttempts) => {
      //   // Calculate stats from attempts
      //   const attempts = quiz.attempts || [];
      //   const highestScore =
      //     attempts.length > 0
      //       ? Math.max(...attempts.map((a) => (a.score / a.totalScore) * 100))
      //       : 0;

      //   const totalAttempts = attempts.length;
      //   const totalTimeSpent = attempts.reduce(
      //     (sum, a) => sum + (a.timeSpent || 0),
      //     0
      //   );
      //   const averageScore =
      //     attempts.length > 0
      //       ? attempts.reduce(
      //           (sum, a) => sum + (a.score / a.totalScore) * 100,
      //           0
      //         ) / attempts.length
      //       : 0;

      //   return {
      //     ...quiz,
      //     stats: {
      //       totalAttempts,
      //       highestScore,
      //       averageScore,
      //       overallAccuracy: averageScore, // Same as average score percentage
      //       totalTimeSpent,
      //       totalCorrectAnswers: attempts.reduce(
      //         (sum, a) => sum + (a.score || 0),
      //         0
      //       ),
      //       totalQuestions: attempts.reduce(
      //         (sum, a) => sum + (a.totalScore || 0),
      //         0
      //       ),
      //       latestAttempt:
      //         attempts.length > 0 ? new Date(attempts[0].endTime) : null,
      //     },
      //     attempts: attempts.map((attempt) => ({
      //       ...attempt,
      //       score: attempt.score,
      //       timeSpent: attempt.timeSpent || 0,
      //       percentage: (attempt.score / attempt.totalScore) * 100,
      //     })),
      //   };
      // });

      // setQuizAttempts(sanitizedData);
      // console.log(sanitizedData);


      setQuizAttempts(Array.isArray(data) ? data : []);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8 flex justify-center items-center">
        <div className="text-black border border-black/10 rounded-lg p-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-light text-black mb-12 text-center tracking-tight">
          Learning Progress
        </h1>

        {quizAttempts.length === 0 ? (
          <div className="text-center text-black/60">
            No quiz attempts found. Start a quiz to see your progress!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizAttempts.map((quiz, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={quiz.quizId}
                className="group border border-black/5 hover:border-black/20 rounded-xl p-6 transition-all duration-500"
              >
                <h2 className="text-xl font-medium text-black mb-6 tracking-tight">
                  {quiz.quizTitle}
                </h2>

                <div className="space-y-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-black/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={16} className="text-black/40" />
                        <span className="text-xs text-black/40">Highest</span>
                      </div>
                      <span className="text-xl font-medium">
                        {quiz.stats?.highestScore.toFixed(1)}%
                      </span>
                    </div>

                    <div className="border border-black/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Check size={16} className="text-black/40" />
                        <span className="text-xs text-black/40">Average</span>
                      </div>
                      <span className="text-xl font-medium">
                        {quiz.stats?.averageScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-black/40">
                      <span>
                        {quiz.stats?.totalAttempts || 0} attempts
                      </span>
                      <span>{formatTime(quiz.stats?.totalTimeSpent || 0)}</span>
                    </div>
                  </div>
                </div>

                {quiz.attempts.length > 0 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedQuiz(
                          selectedQuiz === quiz.quizId ? null : quiz.quizId
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 py-2 border border-black/5 hover:border-black/20 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      {selectedQuiz === quiz.quizId ? (
                        <>
                          Hide Details <IoChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          View Details <IoChevronDown size={16} />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {selectedQuiz === quiz.quizId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-2 overflow-hidden"
                        >
                          {quiz.attempts.map((attempt, i) => (
                            <div
                            key={attempt.attemptId}
                            onClick={() => setSelectedAttempt(attempt)}
                            className="border border-black/5 rounded-lg p-3 text-sm cursor-pointer 
                                       hover:bg-black/5 transition-colors"
                          >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-black/60 text-xs">
                                  Attempt {quiz.attempts.length - i}
                                </span>
                                <span className="font-medium">
                                  {((attempt.score / attempt.totalScore) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-black/40 text-xs">
                                <CiClock1 size={12} />
                                <span>{formatTime(attempt.timeSpent)}</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <AttemptSummaryModal
  attempt={selectedAttempt}
  quizTitle={selectedQuiz ? quizAttempts.find(quiz => quiz.quizId === selectedQuiz)?.quizTitle || '' : ''}
  isOpen={!!selectedAttempt}
  onClose={() => setSelectedAttempt(null)}
/>
    </div>
  );
}

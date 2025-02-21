import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward, IoChevronDown } from "react-icons/io5";
import { CiClock1 } from "react-icons/ci";
import { AttemptSummaryModal } from "../AttemptSummaryModal";
import { QuizAnalytics } from "../analytics/QuizAnalytics";
import { LineChart } from "../charts/Charts";
import { useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

interface Quiz {
  difficulty: "easy" | "medium" | "hard";
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number;
}

interface Attempt {
  attemptId: string;
  score: number;
  totalScore: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export interface QuizAttempts {
  quiz: Quiz;
  timeSpent: number;
  totalScore: number;
  score: number;
  createdAt: string | number | Date;
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
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempts[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<{
    averageScore: number;
    totalTimeSpent: number;
    totalAttempts: number;
    completionRate: number;
  } | null>(null);

  const cookies = new Cookies();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = cookies.get("token");

        // Fetch attempts data
        const attemptsResponse = await fetch(
          "http://localhost:5000/api/attempts/user/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!attemptsResponse.ok) throw new Error("Failed to fetch attempts");
        const attemptsData = await attemptsResponse.json();
        setQuizAttempts(attemptsData);

        // Fetch analytics data
        const analyticsResponse = await fetch(
          "http://localhost:5000/api/analytics/user/current",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!analyticsResponse.ok) throw new Error("Failed to fetch analytics");
        const analyticsData = await analyticsResponse.json();
        setAnalyticsData(analyticsData.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Star background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Learning Dashboard
          </h1>
          <p className="text-gray-300 mt-2">
            Navigate through your educational cosmos
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 border-b border-purple-500/20 pb-1">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon="🌎"
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            icon="📊"
          >
            Analytics
          </TabButton>
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon="🕒"
          >
            History
          </TabButton>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewSection
                quizAttempts={quizAttempts}
                analyticsData={analyticsData}
              />
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsSection quizAttempts={quizAttempts} />
            </motion.div>
          )}
          {activeTab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HistorySection
                quizAttempts={quizAttempts}
                onAttemptSelect={setSelectedAttempt}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal with themed styling */}
      <AttemptSummaryModal
        attempt={selectedAttempt}
        quizTitle={
          selectedQuiz
            ? quizAttempts.find((q) => q.quizId === selectedQuiz)?.quizTitle ||
              ""
            : ""
        }
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
      />
    </div>
  );
}

interface OverviewSectionProps {
  quizAttempts: QuizAttempts[];
  analyticsData: {
    averageScore: number;
    totalTimeSpent: number;
    totalAttempts: number;
    completionRate: number;
    scoresTrend?: number;
    attemptsTrend?: number;
    timeTrend?: number;
    completionTrend?: number;
  } | null;
}

const OverviewSection = ({
  quizAttempts,
  analyticsData,
}: OverviewSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
  >
    {/* Performance Overview Card */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-2 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6 
                 hover:border-purple-500/40 transition-all duration-300"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">📈</span>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Cosmic Performance Journey
        </h2>
      </div>
      
      <div className="relative">
        {/* Optional: Add space-themed background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-lg" />
        
        <LineChart
          data={quizAttempts.flatMap((quiz) =>
            quiz.attempts.map((attempt) => ({
              date: new Date(attempt.endTime).toLocaleDateString(),
              score: (attempt.score / attempt.totalScore) * 100,
            }))
          )}
          customOptions={{
            scales: {
              y: {
                grid: {
                  color: 'rgba(147, 51, 234, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              },
              x: {
                grid: {
                  color: 'rgba(147, 51, 234, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'rgba(255, 255, 255, 0.9)',
                }
              }
            }
          }}
        />
      </div>
    </motion.div>

    {/* Quick Stats */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <QuickStatCard
        title="Cosmic Average"
        value={`${(analyticsData?.averageScore || 0).toFixed(1)}%`}
        icon="🌟"
        trend={analyticsData?.scoresTrend || 0}
      />
      <QuickStatCard
        title="Space Voyages"
        value={analyticsData?.totalAttempts || 0}
        icon="🚀"
        trend={analyticsData?.attemptsTrend || 0}
      />
      <QuickStatCard
        title="Time in Orbit"
        value={formatTime(analyticsData?.totalTimeSpent || 0)}
        icon="⏱️"
        trend={analyticsData?.timeTrend || 0}
      />
      <QuickStatCard
        title="Mission Success"
        value={`${(analyticsData?.completionRate || 0).toFixed(1)}%`}
        icon="🎯"
        trend={analyticsData?.completionTrend || 0}
      />
    </motion.div>
  </motion.div>
);

const AnalyticsSection = ({
  quizAttempts,
}: {
  quizAttempts: QuizAttempts[];
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <QuizAnalytics data={quizAttempts} />
  </motion.div>
);

const HistorySection = ({
  quizAttempts,
  onAttemptSelect,
}: {
  quizAttempts: QuizAttempts[];
  onAttemptSelect: (attempt: Attempt) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
    {quizAttempts.map((quiz) => (
      <QuizHistoryCard
        key={quiz.quizId}
        quiz={quiz}
        onAttemptSelect={onAttemptSelect}
      />
    ))}
  </motion.div>
);

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  icon,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      flex items-center space-x-2 px-6 py-3 rounded-t-lg transition-all duration-300
      ${
        active
          ? "bg-gray-800/50 text-white border-t border-x border-purple-500/30"
          : "text-gray-400 hover:text-white hover:bg-gray-800/30"
      }
    `}
  >
    <span>{icon}</span>
    <span>{children}</span>
    {active && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
        layoutId="activeTab"
      />
    )}
  </motion.button>
);

interface QuickStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number; // Optional trend indicator
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ title, value, icon, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02, translateY: -2 }}
    className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6
               hover:border-purple-500/40 transition-all duration-300"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-gray-400 text-sm">{title}</h3>
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {value}
          </p>
          {trend !== undefined && (
            <TrendIndicator value={trend} />
          )}
        </div>
      </div>
      
      {/* Optional: Add decorative elements */}
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                      flex items-center justify-center">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 
                        animate-pulse" />
      </div>
    </div>
  </motion.div>
);

const TrendIndicator = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center space-x-1 text-sm ${
      isPositive ? 'text-green-400' : 
      isNeutral ? 'text-gray-400' : 
      'text-red-400'
    }`}>
      {isPositive ? '↑' : isNeutral ? '→' : '↓'}
      <span>{Math.abs(value)}%</span>
    </div>
  );
};

const QuizHistoryCard = ({
  quiz,
  onAttemptSelect,
}: {
  quiz: QuizAttempts;
  onAttemptSelect: (attempt: Attempt) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden"
    >
      <motion.div
        className="p-6 cursor-pointer hover:bg-purple-900/20 transition-colors duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚀</span>
              <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {quiz.quizTitle}
              </h3>
            </div>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <span>✨</span>
              <span>{quiz.attempts.length} cosmic journeys</span>
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-purple-400"
          >
            <IoChevronDown size={24} />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 space-y-3"
          >
            {quiz.attempts.map((attempt, index) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                key={attempt.attemptId}
                onClick={() => onAttemptSelect(attempt)}
                className="group relative p-4 bg-gray-800/50 rounded-xl border border-purple-500/20 
                         hover:border-purple-500/40 cursor-pointer transition-all duration-300
                         hover:transform hover:translate-x-2"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <ScoreIndicator score={(attempt.score / attempt.totalScore) * 100} />
                      <p className="font-semibold text-white">
                        Score: {((attempt.score / attempt.totalScore) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center space-x-2">
                      <span>📅</span>
                      <span>{new Date(attempt.startTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <CiClock1 className="text-xl" />
                    <span className="font-medium">{formatTime(attempt.timeSpent)}</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoArrowForward />
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative gradient line */}
                <motion.div
                  layoutId={`line-${attempt.attemptId}`}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 
                           opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Score Indicator Component
const ScoreIndicator = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '⭐';
    return '💫';
  };

  return (
    <span className={`${getColor(score)} text-xl`}>
      {getEmoji(score)}
    </span>
  );
};

function formatTime(totalTimeSpent: number | undefined): string {
  if (!totalTimeSpent) return "0m";

  const hours = Math.floor(totalTimeSpent / 3600);
  const minutes = Math.floor((totalTimeSpent % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

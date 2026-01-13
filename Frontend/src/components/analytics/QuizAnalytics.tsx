import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { QuizAttempts } from '../dashboard/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface QuizAnalyticsProps {
  data: QuizAttempts[];
}

export const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  // Calculate analytics
  const difficultyDistribution = data.reduce((acc, quiz) => {
    const difficulty = quiz.quiz?.difficulty?.toLowerCase() || 'unknown';
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const performanceData = data.map(quiz => ({
    quizTitle: quiz.quizTitle,
    averageScore: quiz.attempts.reduce((sum, attempt) => 
      sum + (attempt.score / attempt.totalScore * 100), 0) / quiz.attempts.length || 0
  }));

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
          callback: function(tickValue: number | string) {
            return `${tickValue}%`;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Learning Journey Progress',
        color: '#fff',
        font: {
          size: 16
        }
      }
    }
  };

  const lineChartData = {
    labels: performanceData.map(item => item.quizTitle),
    datasets: [{
      label: 'Knowledge Growth',
      data: performanceData.map(item => item.averageScore),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.5)',
      tension: 0.4,
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgb(147, 51, 234)',
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const doughnutData = {
    labels: Object.keys(difficultyDistribution).map(d => d.toUpperCase()),
    datasets: [{
      data: Object.values(difficultyDistribution),
      backgroundColor: [
        'rgba(134, 239, 172, 0.9)', // Easy
        'rgba(250, 204, 21, 0.9)',  // Medium
        'rgba(248, 113, 113, 0.9)', // Hard
        'rgba(148, 163, 184, 0.9)'  // Unknown
      ],
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }]
  };

  const totalAttempts = data.reduce((sum, quiz) => sum + quiz.attempts.length, 0);
  const averageScore = performanceData.reduce((sum, quiz) => sum + quiz.averageScore, 0) / performanceData.length;
  const totalTimeSpent = data.reduce((sum, quiz) => 
    sum + quiz.attempts.reduce((attemptsSum, attempt) => attemptsSum + (attempt.timeSpent || 0), 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="space-y-8 p-8">
        {/* Star-like particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars"></div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Your Learning Universe
          </h1>
          <p className="text-gray-300 mt-2">Explore your quiz journey through the cosmos</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Quizzes Explored", value: data.length, icon: "🚀" },
            { title: "Learning Attempts", value: totalAttempts, icon: "✨" },
            { title: "Knowledge Level", value: `${averageScore.toFixed(1)}%`, icon: "🌟" },
            { title: "Time in Space", value: formatTime(totalTimeSpent), icon: "⏱️" },
          ].map((card, index) => (
            <AnalyticCard key={index} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20"
          >
            <Line data={lineChartData} options={chartOptions} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20"
          >
            <Doughnut data={doughnutData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Challenge Levels Distribution'
                }
              }
            }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const AnalyticCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <motion.div
    whileHover={{ scale: 1.05, translateY: -5 }}
    className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20 
               hover:border-purple-500/40 transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </motion.div>
);

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
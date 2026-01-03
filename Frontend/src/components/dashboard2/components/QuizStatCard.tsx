// components/dashboard2/components/QuizStatCard.tsx
import { Trophy, BarChart3, Clock, Target, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';
import { formatDate } from '../../../utils/dateUtils';
import { formatTime } from '../../../utils/formatTime';
import ScoreIndicator from './ScoreIndicator';
import type { QuizAttempts } from '../types';

interface QuizStatCardProps {
    quiz: QuizAttempts;
    onViewDetails?: () => void;
}

export default function QuizStatCard({ quiz, onViewDetails }: QuizStatCardProps) {
    if (!quiz) {
        return null;
    }

    // Use API stats and calculate additional stats
    const apiStats = quiz.stats;
    const additionalStats = calculateAdditionalStats(quiz);

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 p-6 
                        hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 
                        transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center 
                                  group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                        <span className="text-purple-600 font-bold text-lg">
                            {quiz.quizTitle.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-700 transition-colors">
                            {quiz.quizTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Last attempt: {additionalStats.latestAttempt ? formatDate(additionalStats.latestAttempt) : 'Never'}
                        </p>
                    </div>
                </div>

                <ScoreIndicator score={apiStats.highestScore} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                <StatItem
                    label="Highest Score"
                    value={`${apiStats.highestScore.toFixed(0)}%`}
                    icon={<Trophy className="w-4 h-4" />}
                    color="text-yellow-600"
                    bg="bg-yellow-50"
                />
                <StatItem
                    label="Average Score"
                    value={`${apiStats.averageScore.toFixed(0)}%`}
                    icon={<BarChart3 className="w-4 h-4" />}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatItem
                    label="Total Time"
                    value={formatTime(apiStats.totalTimeSpent)}
                    icon={<Clock className="w-4 h-4" />}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatItem
                    label="Accuracy"
                    value={`${additionalStats.overallAccuracy.toFixed(0)}%`}
                    icon={<Target className="w-4 h-4" />}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Overall Progress</span>
                    <span className="font-bold text-gray-900">
                        {additionalStats.totalCorrectAnswers}/{additionalStats.totalQuestions} correct
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(additionalStats.overallAccuracy, 100)}%` }}
                    />
                </div>
            </div>

            {/* Action Button */}
            {onViewDetails && (
                <button
                    onClick={onViewDetails}
                    className="w-full py-2.5 flex items-center justify-center gap-2 
                             text-sm font-medium text-purple-600 bg-purple-50 
                             hover:bg-purple-100 rounded-xl transition-colors duration-200 group/btn"
                >
                    <span>View Detailed Analytics</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            )}
        </div>
    );
}

interface StatItemProps {
    label: string;
    value: string;
    icon: ReactNode;
    color: string;
    bg: string;
}

function StatItem({ label, value, icon, color, bg }: StatItemProps) {
    return (
        <div className={`p-3 rounded-xl ${bg} bg-opacity-50 border border-transparent hover:border-gray-100 transition-colors`}>
            <div className={`flex items-center gap-1.5 mb-1 ${color}`}>
                {icon}
                <span className="text-xs font-medium opacity-80">{label}</span>
            </div>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
    );
}

function calculateAdditionalStats(quiz: QuizAttempts) {
    if (!quiz || !quiz.attempts || quiz.attempts.length === 0) {
        return {
            overallAccuracy: 0,
            totalCorrectAnswers: 0,
            totalQuestions: 0,
            latestAttempt: null as Date | null
        };
    }

    const totalCorrect = quiz.attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const totalQuestions = quiz.attempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0);

    const latestAttemptDate = quiz.attempts.length > 0
        ? new Date(quiz.attempts[quiz.attempts.length - 1].endTime)
        : null;

    const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    return {
        overallAccuracy: isNaN(overallAccuracy) ? 0 : overallAccuracy,
        totalCorrectAnswers: totalCorrect,
        totalQuestions,
        latestAttempt: latestAttemptDate
    };
}

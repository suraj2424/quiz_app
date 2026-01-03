// components/dashboard2/components/RecentActivity.tsx
import { TrendingUp, Clock, ChevronRight, Activity } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/dateUtils';
import { formatTime } from '../../../utils/formatTime';
import type { QuizAttempts } from '../types';

interface RecentActivityProps {
    quizAttempts: QuizAttempts[];
    maxItems?: number;
    onShowMore?: () => void;
}

export default function RecentActivity({ quizAttempts, maxItems = 3, onShowMore }: RecentActivityProps) {
    // Flatten all attempts and sort by most recent
    const allAttempts = quizAttempts
        .flatMap(quiz =>
            quiz.attempts.map(attempt => ({
                ...attempt,
                quizTitle: quiz.quizTitle,
                quizId: quiz.quizId
            }))
        )
        .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());

    const displayedAttempts = allAttempts.slice(0, maxItems);
    const hasMore = allAttempts.length > maxItems;
    const remainingCount = allAttempts.length - maxItems;

    if (allAttempts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">No recent activity</p>
                    <p className="text-xs text-gray-400">Start taking quizzes to see your progress</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 
                        hover:border-gray-200 transition-colors duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                        {allAttempts.length}
                    </span>
                </div>
            </div>

            {/* Activity List */}
            <div className="space-y-3">
                {displayedAttempts.map((attempt, index) => (
                    <ActivityItem
                        key={attempt.attemptId}
                        attempt={attempt}
                        isFirst={index === 0}
                    />
                ))}
            </div>

            {/* Show More Button */}
            {hasMore && onShowMore && (
                <button
                    onClick={onShowMore}
                    className="w-full mt-4 py-3 flex items-center justify-center gap-2
                               text-sm font-medium text-purple-600 
                               bg-purple-50 hover:bg-purple-100 
                               rounded-xl transition-all duration-200
                               group"
                >
                    <span>View {remainingCount} more</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
            )}
        </div>
    );
}

interface ActivityItemProps {
    attempt: {
        attemptId: string;
        score: number;
        totalScore: number;
        timeSpent: number;
        endTime: string;
        quizTitle: string;
        completed: boolean;
    };
    isFirst?: boolean;
}

function ActivityItem({ attempt, isFirst = false }: ActivityItemProps) {
    const percentage = attempt.totalScore > 0
        ? (attempt.score / attempt.totalScore) * 100
        : 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return { text: 'text-green-600', bg: 'bg-green-500' };
        if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500' };
        return { text: 'text-red-500', bg: 'bg-red-500' };
    };

    const colors = getScoreColor(percentage);

    return (
        <div className={`group relative flex items-center gap-4 p-3 rounded-xl
                        hover:bg-gray-50 transition-all duration-200 cursor-pointer
                        ${isFirst ? 'bg-gradient-to-r from-purple-50/50 to-transparent' : ''}`}>
            {/* Live indicator for first item */}
            {isFirst && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                </div>
            )}

            {/* Quiz Icon */}
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center
                            group-hover:bg-purple-100 transition-colors duration-200 flex-shrink-0">
                <span className="text-gray-600 group-hover:text-purple-600 font-semibold text-sm transition-colors">
                    {attempt.quizTitle.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate max-w-[140px]">
                        {attempt.quizTitle}
                    </h4>
                    <span className={`text-sm font-semibold ${colors.text}`}>
                        {percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatRelativeTime(attempt.endTime)}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(attempt.timeSpent)}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

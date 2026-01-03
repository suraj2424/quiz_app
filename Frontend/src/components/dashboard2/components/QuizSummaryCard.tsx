// components/dashboard2/components/QuizSummaryCard.tsx
import { ChevronRight, Clock, Trophy } from 'lucide-react';
import { formatTime } from '../../../utils/formatTime';
import type { QuizAttempts } from '../types';

interface QuizSummaryCardProps {
    quiz: QuizAttempts;
    onClick?: () => void;
}

export default function QuizSummaryCard({ quiz, onClick }: QuizSummaryCardProps) {
    if (!quiz) {
        return null;
    }

    // Use stats directly from API
    const stats = quiz.stats;
    const latestAttempt = quiz.attempts && quiz.attempts.length > 0
        ? quiz.attempts[quiz.attempts.length - 1]
        : null;

    return (
        <div
            className={`group bg-white rounded-2xl border border-gray-100 p-5 
                        hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 
                        transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center 
                                  group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                        <span className="text-purple-600 font-bold text-sm">
                            {quiz.quizTitle.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
                            {quiz.quizTitle}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {onClick && (
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center 
                                  group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Best Score</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        {stats.highestScore.toFixed(0)}%
                    </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Total Time</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        {formatTime(stats.totalTimeSpent)}
                    </span>
                </div>
            </div>

            {/* Latest Attempt Bar */}
            {latestAttempt && (
                <div className="pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500 font-medium">Last Attempt</span>
                        <span className={`font-bold ${latestAttempt.percentage >= 80 ? 'text-green-600' :
                                latestAttempt.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                            {latestAttempt.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${latestAttempt.percentage >= 80 ? 'bg-green-500' :
                                    latestAttempt.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${latestAttempt.percentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

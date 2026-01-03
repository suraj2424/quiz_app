// components/dashboard2/components/QuizHistoryCard.tsx
import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Calendar } from 'lucide-react';
import ScoreIndicator from './ScoreIndicator';
import { formatTime } from '../../../utils/formatTime';
import type { QuizAttempts, Attempt } from '../types';

interface QuizHistoryCardProps {
    quiz: QuizAttempts;
    onAttemptSelect: (attempt: Attempt) => void;
}

export default function QuizHistoryCard({ quiz, onAttemptSelect }: QuizHistoryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Safety checks for empty or invalid data
    if (!quiz || !quiz.attempts || quiz.attempts.length === 0) {
        return null;
    }

    // Calculate best score with safety checks
    const bestScore = Math.max(...quiz.attempts.map(a => {
        const score = a.totalScore > 0 ? (a.score / a.totalScore) * 100 : 0;
        return isNaN(score) ? 0 : score;
    }));

    // Sort attempts by date (newest first)
    const sortedAttempts = [...quiz.attempts].sort((a, b) =>
        new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Quiz Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors duration-200"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold text-lg">
                            {quiz.quizTitle.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{quiz.quizTitle}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span>{quiz.attempts.length} attempt{quiz.attempts.length !== 1 ? 's' : ''}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-green-600 font-medium">Best: {bestScore.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </button>

            {/* Attempts List */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
                    {sortedAttempts.map((attempt) => {
                        const attemptScore = attempt.totalScore > 0 ? (attempt.score / attempt.totalScore) * 100 : 0;
                        return (
                            <button
                                key={attempt.attemptId}
                                onClick={() => onAttemptSelect(attempt)}
                                className="group w-full p-4 bg-white rounded-xl border border-gray-100 
                                         hover:border-purple-200 hover:shadow-sm hover:translate-x-1
                                         transition-all duration-200 text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <ScoreIndicator score={attemptScore} />
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {attemptScore.toFixed(0)}%
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(attempt.startTime).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatTime(attempt.timeSpent)}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

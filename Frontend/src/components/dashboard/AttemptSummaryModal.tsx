import { formatDateTime } from '../../utils/dateUtils';
import { formatTime } from '../../utils/formatTime';
import Modal from '../UI/Modal';
import { useNavigate } from 'react-router-dom';

import ScoreIndicator from './ScoreIndicator';
import type { Attempt } from './types';

interface AttemptSummaryModalProps {
  attempt: Attempt | null;
  isOpen: boolean;
  onClose: () => void;
  quizTitle?: string;
}

export default function AttemptSummaryModal({ 
  attempt, 
  isOpen, 
  onClose, 
  quizTitle 
}: AttemptSummaryModalProps) {
  if (!attempt) return null;

  const percentage = (attempt.score / attempt.totalScore) * 100;
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;
  const isPassing = percentage >= 60;

  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4">
            <ScoreIndicator score={percentage} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Attempt Summary
          </h2>
          
          {quizTitle && (
            <p className="text-lg text-gray-600">{quizTitle}</p>
          )}
        </div>

        {/* Score Display */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isExcellent ? 'text-green-600' : 
              isGood ? 'text-blue-600' : 
              isPassing ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {percentage.toFixed(1)}%
            </div>
            
            <div className="text-lg text-gray-700 mb-2">
              {attempt.score} out of {attempt.totalScore} correct
            </div>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isExcellent ? 'bg-green-100 text-green-800' :
              isGood ? 'bg-blue-100 text-blue-800' :
              isPassing ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {isExcellent ? '🏆 Excellent!' :
               isGood ? '⭐ Great job!' :
               isPassing ? '👍 Good effort!' :
               '📚 Keep practicing!'}
            </div>
          </div>
        </div>

        {/* Attempt Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <DetailCard
            icon="📅"
            title="Date & Time"
            value={formatDateTime(attempt.startTime)}
            subtitle="Started"
          />
          
          <DetailCard
            icon="⏱️"
            title="Time Taken"
            value={formatTime(attempt.timeSpent)}
            subtitle="Total duration"
          />
          
          <DetailCard
            icon="🎯"
            title="Accuracy"
            value={`${percentage.toFixed(1)}%`}
            subtitle="Overall score"
          />
          
          <DetailCard
            icon="✅"
            title="Status"
            value={attempt.completed ? "Completed" : "Incomplete"}
            subtitle={attempt.completed ? "Successfully finished" : "Not finished"}
          />
        </div>

        {/* Performance Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-medium text-green-600">{attempt.score}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Incorrect Answers</span>
              <span className="font-medium text-red-600">{attempt.totalScore - attempt.score}</span>
            </div>
            
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">Total Questions</span>
              <span className="font-medium text-gray-900">{attempt.totalScore}</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isExcellent ? 'bg-green-500' :
                  isGood ? 'bg-blue-500' :
                  isPassing ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Insights/Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">💡 Insights</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {isExcellent && <li>Outstanding performance! You've mastered this topic.</li>}
            {isGood && !isExcellent && <li>Great work! You have a solid understanding of the material.</li>}
            {isPassing && !isGood && <li>Good effort! Review the topics you missed to improve further.</li>}
            {!isPassing && <li>Keep practicing! Consider reviewing the material before trying again.</li>}
            <li>Time taken: {formatTime(attempt.timeSpent)} - {
              attempt.timeSpent < 300 ? 'Quick completion!' :
              attempt.timeSpent < 900 ? 'Good pacing.' :
              'Take your time to think through each question.'
            }</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Close
          </button>
          
          <button
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
            onClick={() => {
              // Handle retake quiz action
              console.log('Retake quiz:', attempt.attemptId);
            }}
          >
            Retake Quiz
          </button>
          
          <button
            className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors duration-200"
            onClick={() => navigate(`/attempt/${attempt.attemptId}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface DetailCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}

function DetailCard({ icon, title, value, subtitle }: DetailCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
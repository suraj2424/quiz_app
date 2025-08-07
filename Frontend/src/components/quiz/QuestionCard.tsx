// import { useState } from 'react';
import { Question } from '../../utils/quizTypes';
import OptionCard from './OptionCard';
import Button from '../UI/Button';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | string | null;
  shortAnswer: string;
  onAnswerSelect: (index: number) => void;
  onShortAnswerChange: (value: string) => void;
  showHint: boolean;
  onHintClick: () => void;
  on5050Click: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  shortAnswer,
  onAnswerSelect,
  onShortAnswerChange,
  showHint,
  onHintClick,
  on5050Click
}: QuestionCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-8">
      {/* Question Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Question {questionNumber}
            <span className="text-sm text-gray-600 ml-2 font-normal">
              of {totalQuestions}
            </span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {question.questionType}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {question.points} points
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {question.hint && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHintClick}
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Hint
            </Button>
          )}
          
          {question.questionType === "Multiple Choice" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={on5050Click}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              50/50
            </Button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <p className="text-lg text-gray-800 leading-relaxed font-medium">
          {question.questionText}
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-8">
        {question.questionType === "Short Answer" ? (
          <div className="space-y-3">
            <textarea
              value={shortAnswer}
              onChange={(e) => onShortAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors duration-200 bg-white"
              rows={4}
            />
            <p className="text-sm text-gray-500 italic">
              Your answer will be evaluated for accuracy, allowing for minor spelling differences.
            </p>
          </div>
        ) : (
          question.options.map((option, index) => (
            <OptionCard
              key={index}
              option={option.optionText}
              index={index}
              isSelected={selectedAnswer === index}
              isHidden={option.hidden}
              onClick={() => onAnswerSelect(index)}
            />
          ))
        )}
      </div>

      {/* Hint Display */}
      {showHint && question.hint && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Hint:</p>
              <p className="text-yellow-700">{question.hint}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
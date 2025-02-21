import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import { AiOutlineFileText } from "react-icons/ai";
// clock from react-icons
import { FaClock } from 'react-icons/fa';
import { FaX } from "react-icons/fa6";


interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    difficulty: string;
    questionCount: number;
    tags: string[];
    createdBy: {
      name?: string;
    };
  };
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("token");
  const handleStartQuiz = async () => {
    try {
      if (!token) {
        setShowAuthDialog(true);
        return;
      }

      // Verify token with backend
      const response = await fetch("http://localhost:5000/api/verify-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setErrorMessage("Session expired. Please login again.");
        setShowError(true);
        setShowAuthDialog(true);
        return;
      }

      // If token is valid, proceed to quiz
      navigate(`/quiz/id=${quiz._id}`);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setShowError(true);
    }
  };

  const handleLogin = () => {
    navigate("/login?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  const handleRegister = () => {
    navigate("/register?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  const getDifficultyStyles = (difficulty: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-medium";
    switch (difficulty) {
      case "EASY":
        return `${baseStyles} bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-700 border border-emerald-500/20`;
      case "MEDIUM":
        return `${baseStyles} bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-700 border border-amber-500/20`;
      case "HARD":
        return `${baseStyles} bg-gradient-to-r from-rose-500/20 to-rose-500/10 text-rose-700 border border-rose-500/20`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">
              {quiz.title}
            </h3>
            <span className={getDifficultyStyles(quiz.difficulty)}>
              {quiz.difficulty}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quiz.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Info Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <AiOutlineFileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {quiz.questionCount} Questions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                ~{quiz.questionCount * 1.5} mins
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Created by</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                  {quiz.createdBy.name?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {quiz.createdBy.name}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleStartQuiz}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                       text-white font-medium hover:from-indigo-600 hover:to-purple-600 
                       transform transition-all duration-200 hover:shadow-lg
                       focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </motion.div>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Join to Start Quiz
              </h3>
              <p className="text-gray-600 mt-2">
                Create an account or log in to track your progress and compete with others.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-medium hover:from-indigo-600 hover:to-purple-600 
                         transition-all duration-200"
              >
                Log In
              </button>
              <button
                onClick={handleRegister}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 
                         font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowAuthDialog(false)}
                className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 
                         font-medium transition-colors duration-200"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Error Alert */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 relative"
        >
          <span className="block sm:inline">{errorMessage}</span>
          <button
            onClick={() => setShowError(false)}
            className="absolute top-4 right-4 text-rose-500 hover:text-rose-700"
          >
            <FaX className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizCard;

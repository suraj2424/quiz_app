import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { AiOutlineFileText } from "react-icons/ai";
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
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("token");

  // Handle ESC key press
  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowAuthDialog(false);
      setShowError(false);
    }
  }, []);

  // Prevent body scroll when dialog is open and handle ESC key
  useEffect(() => {
    if (showAuthDialog) {
      // Store original scroll position
      const scrollY = window.scrollY;
      
      // Prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      
      // Add ESC key listener
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, scrollY);
        
        // Remove ESC key listener
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [showAuthDialog, handleEscKey]);

  const handleStartQuiz = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setShowError(false);
      
      if (!token) {
        setShowAuthDialog(true);
        return;
      }

      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

      // Verify token with backend
      const response = await fetch(`${backendUrl}/api/verify-token`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    setShowError(false);
    navigate("/login?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  const handleRegister = () => {
    setShowAuthDialog(false);
    setShowError(false);
    navigate("/register?type=student", {
      state: { returnUrl: `/quiz/id=${quiz._id}` },
    });
  };

  const closeAuthDialog = () => {
    setShowAuthDialog(false);
    setShowError(false);
  };

  const closeError = () => {
    setShowError(false);
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

  // Auth Dialog Component with Portal
  const AuthDialog = () => {
    if (typeof window === 'undefined') return null;
    
    return createPortal(
      <AnimatePresence mode="wait">
        {showAuthDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthDialog}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              {/* Close button */}
              <button
                onClick={closeAuthDialog}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                aria-label="Close dialog"
              >
                <FaX className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <h3 id="auth-dialog-title" className="text-xl font-semibold text-gray-900">
                  Join to Start Quiz
                </h3>
                <p className="text-gray-600 mt-2">
                  Create an account or log in to track your progress and compete with others.
                </p>
              </div>

              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm relative"
                  >
                    <span className="pr-8">{errorMessage}</span>
                    <button
                      onClick={closeError}
                      className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 transition-colors duration-200"
                      aria-label="Close error"
                    >
                      <FaX className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                           text-white font-medium hover:from-indigo-600 hover:to-purple-600 
                           transition-all duration-200 transform hover:scale-[1.02] focus:outline-none 
                           focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Log In
                </button>
                <button
                  onClick={handleRegister}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 
                           font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Create Account
                </button>
                <button
                  onClick={closeAuthDialog}
                  className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 
                           font-medium transition-colors duration-200 focus:outline-none 
                           focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-xl"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight pr-4">
              {quiz.title}
            </h3>
            <span className={getDifficultyStyles(quiz.difficulty)}>
              {quiz.difficulty}
            </span>
          </div>

          {/* Tags */}
          {quiz.tags.length > 0 && (
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
          )}

          {/* Info Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <AiOutlineFileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {quiz.questionCount} Question{quiz.questionCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                ~{Math.ceil(quiz.questionCount * 1.5)} min{Math.ceil(quiz.questionCount * 1.5) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Created by</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  {quiz.createdBy.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {quiz.createdBy.name || 'Unknown'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                       text-white font-medium hover:from-indigo-600 hover:to-purple-600 
                       transform transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                       focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Loading...' : 'Start Quiz'}
            </button>
          </div>
        </div>

        {/* Error Alert - shown inside card when dialog is not open */}
        <AnimatePresence>
          {showError && !showAuthDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-6 mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 relative"
            >
              <span className="block pr-8">{errorMessage}</span>
              <button
                onClick={closeError}
                className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 transition-colors duration-200"
                aria-label="Close error"
              >
                <FaX className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Auth Dialog Portal */}
      <AuthDialog />
    </>
  );
};

export default QuizCard;
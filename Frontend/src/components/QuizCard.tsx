import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="relative">
      {/* Quiz Card */}
      <div className="bg-white border border-gray-300 rounded bg-opacity-30 p-2 transition-all duration-300 hover:bg-slate-50">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold mb-1">{quiz.title}</h3>
            <p
              className={`mb-2 p-0 justify-center flex items-center border text-sm font-semibold font-roboto tracking-wider ${
                quiz.difficulty === "EASY"
                  ? "text-green-700 bg-green-300 border-green-600 w-11"
                  : quiz.difficulty === "MEDIUM"
                  ? "text-yellow-700 bg-yellow-300 border-yellow-500 w-[70px]"
                  : "text-red-700 bg-red-300 border-red-600 w-10"
              }`}
            >
              {quiz.difficulty}
            </p>
          </div>
          <div className="flex gap-2 mb-2">
            {quiz.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          <p className="text-gray-500 font-semibold text-sm">
            {quiz.questionCount} Questions
          </p>
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-xs font-semibold text-purple-700">
                Created by
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs font-semibold text-gray-400">
                  {quiz.createdBy.name}
                </p>
              </div>
            </div>
            <div>
              <button
                className="border-gray-300 bg-gray-50 border text-black hover:bg-slate-700 hover:text-white font-bold py-2 px-4 rounded transition-all ease-in-out duration-300"
                onClick={handleStartQuiz}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {showError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            onClick={() => setShowError(false)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Auth Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Authentication Required
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Please login or register to start the quiz.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Register
              </button>
              <button
                onClick={() => setShowAuthDialog(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;

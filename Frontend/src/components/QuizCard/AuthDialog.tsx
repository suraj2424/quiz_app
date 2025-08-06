// components/QuizCard/AuthDialog.tsx
import { useEffect } from "react";
import Modal from "../UI/Modal";
import ErrorAlert from "./ErrorAlert";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  error?: string | null;
  onClearError: () => void;
}

export default function AuthDialog({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  error, 
  onClearError 
}: AuthDialogProps) {
  // Clear error when dialog closes
  useEffect(() => {
    if (!isOpen && error) {
      onClearError();
    }
  }, [isOpen, error, onClearError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Test Your Knowledge?
          </h3>
          <p className="text-gray-600">
            Sign in to track your progress and compete with others.
          </p>
        </div>

        {/* Error Alert */}
        <ErrorAlert 
          error={error}
          onClose={onClearError}
          isVisible={!!error}
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
          
          <button
            onClick={onRegister}
            className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Create Account
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
}
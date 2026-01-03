// components/QuizCard/AuthDialog.tsx
import { useEffect } from "react";
import { Lightbulb, LogIn, UserPlus, X } from "lucide-react";
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
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-6 px-6 text-center bg-gradient-to-b from-purple-50/80 to-transparent">
          {/* Icon */}
          <div className="relative inline-flex">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-purple-500/25">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-purple-300/30 animate-pulse" />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            Ready to Test Your Knowledge?
          </h3>
          <p className="text-gray-600 max-w-xs mx-auto">
            Sign in to track your progress and compete with others.
          </p>
        </div>

        {/* Content Section */}
        <div className="px-6 pb-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <ErrorAlert 
                error={error}
                onClose={onClearError}
                isVisible={!!error}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Sign In Button */}
            <button
              onClick={onLogin}
              className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <LogIn className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              <span>Sign In</span>
            </button>
            
            {/* Create Account Button */}
            <button
              onClick={onRegister}
              className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 hover:text-purple-700 font-semibold rounded-xl transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Create Account</span>
            </button>
            
            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400 uppercase tracking-wider">or</span>
              </div>
            </div>
            
            {/* Maybe Later Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </Modal>
  );
}
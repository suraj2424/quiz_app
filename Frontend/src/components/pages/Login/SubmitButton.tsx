import { motion } from "framer-motion";
import { SubmitButtonProps } from "./types";

export const SubmitButton = ({ 
  loading, 
  text = "Sign In", 
  loadingText = "Signing In..." 
}: SubmitButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    type="submit"
    disabled={loading}
    className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
               text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25
               hover:from-indigo-600 hover:to-purple-600 transition-all duration-200
               disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                       rounded-full animate-spin" />
        <span>{loadingText}</span>
      </div>
    ) : (
      text
    )}
  </motion.button>
);
import { motion } from "framer-motion";
import { IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import { PasswordInputProps } from "./types";

export const PasswordInput = ({ value, onChange, error, showPassword, onTogglePassword }: PasswordInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Password
    </label>
    <motion.div className="relative">
      <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your password"
        className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl text-gray-900 
                   placeholder:text-gray-400 transition-all duration-200
                   ${error
            ? "border-2 border-rose-500 focus:border-rose-500"
            : "border border-gray-200 focus:border focus:border-purple-500"
          } outline-none`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                   hover:text-gray-600 transition-colors"
      >
        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
      </button>
    </motion.div>
    {error && (
      <p className="mt-1.5 text-rose-500 text-sm">{error}</p>
    )}
  </div>
);
import { motion } from "framer-motion";
import { IoMail } from "react-icons/io5";
import { EmailInputProps } from "./types";

export const EmailInput = ({ value, onChange, error }: EmailInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Email Address
    </label>
    <motion.div className="relative">
      <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your email"
        className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                   placeholder:text-gray-400 transition-all duration-200
                   ${error
            ? "border-2 border-rose-500 focus:border-rose-500"
            : "border border-gray-200 focus:border focus:border-purple-500"
          } outline-none`}
      />
    </motion.div>
    {error && (
      <p className="mt-1.5 text-rose-500 text-sm">{error}</p>
    )}
  </div>
);
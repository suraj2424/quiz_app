import { motion } from "framer-motion";
import { TextInputProps } from "./types";

export const TextInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}: TextInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <motion.input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                 placeholder:text-gray-400 transition-all duration-200
                 ${error
          ? "border-2 border-rose-500 focus:border-rose-500"
          : "border border-gray-200 focus:border focus:border-purple-500"
        } outline-none`}
    />
    {error && (
      <p className="mt-1.5 text-rose-500 text-sm">{error}</p>
    )}
  </div>
);

export default TextInput;
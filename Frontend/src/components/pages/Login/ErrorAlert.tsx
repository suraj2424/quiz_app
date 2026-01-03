import { motion } from "framer-motion";
import { IoWarning } from "react-icons/io5";
import { ErrorAlertProps } from "./types";

export const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600"
  >
    <div className="flex items-center gap-2">
      <IoWarning className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  </motion.div>
);
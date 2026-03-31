import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useUser();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 border-[3px] border-black dark:border-white bg-amber-400 dark:bg-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-black" />
        )}
      </motion.div>
    </button>
  );
}

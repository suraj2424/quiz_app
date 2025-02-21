import React from 'react';
import { LuAlarmClock } from "react-icons/lu";
import { motion } from 'framer-motion';

interface TimerAnimationProps {
  totalTime: number;
  timeElapsed: number;
}

const TimerAnimation: React.FC<TimerAnimationProps> = ({ totalTime, timeElapsed }) => {
  const percentage = (timeElapsed / totalTime) * 100;
  const timeLeft = totalTime - timeElapsed;
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const getThemeStyles = () => {
    if (percentage >= 75) {
      return {
        text: 'text-red-500',
        border: 'border-red-500',
        bg: 'bg-red-50',
        ring: 'ring-red-500',
        progress: 'from-red-500 to-red-600'
      };
    }
    if (percentage >= 50) {
      return {
        text: 'text-amber-500',
        border: 'border-amber-500',
        bg: 'bg-amber-50',
        ring: 'ring-amber-500',
        progress: 'from-amber-500 to-amber-600'
      };
    }
    return {
      text: 'text-emerald-500',
      border: 'border-emerald-500',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-500',
      progress: 'from-emerald-500 to-emerald-600'
    };
  };

  const theme = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center justify-center p-4 rounded-xl
                  backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 z-10">
        <motion.div
          animate={{ scale: [1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`p-2 rounded-full ${theme.bg} ${theme.ring} ring-1`}
        >
          <LuAlarmClock className={`text-2xl ${theme.text}`} />
        </motion.div>

        <div className="flex gap-1 font-mono text-2xl font-bold">
          {[
            { value: hours, label: 'h' },
            { value: minutes, label: 'm' },
            { value: seconds, label: 's' }
          ].map((time, index) => (
            <motion.div
              key={index}
              className={`flex items-center ${index !== 0 ? 'ml-1' : ''}`}
            >
              <motion.div
                key={time.value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`px-2 py-1 rounded bg-white/50 backdrop-blur-sm
                           border ${theme.border} ${theme.text}`}
              >
                {time.value.toString().padStart(2, '0')}
              </motion.div>
              <span className={`text-sm ${theme.text} ml-0.5`}>{time.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Warning Pulse when time is running low */}
      {percentage >= 75 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500/10 rounded-xl"
        />
      )}
    </motion.div>
  );
};

export default TimerAnimation;

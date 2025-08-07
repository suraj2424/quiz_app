import { useState, useEffect, useRef } from 'react';

export const useQuizTimer = (
  isActive: boolean,
  timeLimit: number,
  onTimeUp: () => void
) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }

    if (isActive && timeElapsed < timeLimit) {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const currentTime = new Date();
          const actualTimeElapsed = Math.floor(
            (currentTime.getTime() - startTimeRef.current.getTime()) / 1000
          );

          if (actualTimeElapsed >= timeLimit) {
            setTimeElapsed(timeLimit);
            onTimeUp();
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          } else {
            setTimeElapsed(actualTimeElapsed);
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timeLimit, onTimeUp]);

  const resetTimer = () => {
    setTimeElapsed(0);
    startTimeRef.current = null;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    timeElapsed,
    resetTimer,
    startTime: startTimeRef.current
  };
};
import React from 'react';
import { LuAlarmClock } from "react-icons/lu";

interface TimerAnimationProps {
  totalTime: number;
  timeElapsed: number;
}

const TimerAnimation: React.FC<TimerAnimationProps> = ({ totalTime, timeElapsed }) => {
  const percentage = (timeElapsed / totalTime) * 100;
  // const remainingTime = Math.ceil(totalTime - timeElapsed);

  const getTextColor = () => {
    if (percentage >= 75) return 'bg-red-500';
    if (percentage >= 50) return 'bg-yellow-400';
    return 'bg-black';
  };

  return (
    <div className={`flex items-center space-x-3 font-openSans p-2 ${getTextColor()} rounded`}>
      {/* Timer Animation */}
      <LuAlarmClock className='text-2xl text-white'/>
      {/* Remaining Time */}
      <div className={`text-2xl font-bold text-white transition-all duration-300 ease-in-out`}>
        {Math.floor((totalTime-timeElapsed)/3600).toString().padStart(2,'0')}:{Math.floor(((totalTime - timeElapsed) % 3600) / 60).toString().padStart(2, '0')}:{((totalTime - timeElapsed) % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default TimerAnimation;

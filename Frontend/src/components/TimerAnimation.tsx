import React from 'react';
import { LuAlarmClock } from "react-icons/lu";

interface TimerAnimationProps {
  totalTime: number;
  timeElapsed: number;
}

const TimerAnimation: React.FC<TimerAnimationProps> = ({ totalTime, timeElapsed }) => {
  const percentage = (timeElapsed / totalTime) * 100;

  const getColors = () => {
    if (percentage >= 75) return 'text-red-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-black';
  };

  const getBorder = () => {
    if (percentage >= 75) return 'border-red-500';
    if (percentage >= 50) return 'border-yellow-500';
    return 'border-gray-500';
  };

  return (
    <div className={`flex items-center space-x-3 font-openSans p-2 ${getColors()} rounded`}>
      <LuAlarmClock className='text-2xl text-white'/>
      <div className={`text-2xl font-bold transition-all duration-300 ease-in-out border ${getBorder()} py-1 px-2 rounded`}>
        {Math.floor((totalTime-timeElapsed)/3600).toString().padStart(2,'0')}:{Math.floor(((totalTime - timeElapsed) % 3600) / 60).toString().padStart(2, '0')}:{((totalTime - timeElapsed) % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default TimerAnimation;

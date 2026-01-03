// components/QuizCard/DifficultyBadge.tsx
import { CheckCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react";

interface DifficultyBadgeProps {
  difficulty: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export default function DifficultyBadge({ 
  difficulty, 
  showIcon = false,
  size = "sm" 
}: DifficultyBadgeProps) {
  const getDifficultyConfig = (level: string) => {
    const sizeStyles = size === "sm" 
      ? "px-2.5 py-1 text-xs gap-1" 
      : "px-3 py-1.5 text-sm gap-1.5";
    
    const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
    
    const baseStyles = `inline-flex items-center rounded-full font-medium whitespace-nowrap border transition-all duration-200 hover:scale-105 ${sizeStyles}`;
    
    switch (level.toUpperCase()) {
      case "EASY":
      case "BEGINNER":
        return {
          className: `${baseStyles} bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/60 hover:border-emerald-300 hover:shadow-sm hover:shadow-emerald-100`,
          icon: <CheckCircle className={iconSize} />,
          text: "Beginner"
        };
      case "MEDIUM":
      case "INTERMEDIATE":
        return {
          className: `${baseStyles} bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200/60 hover:border-amber-300 hover:shadow-sm hover:shadow-amber-100`,
          icon: <Clock className={iconSize} />,
          text: "Intermediate"
        };
      case "HARD":
      case "ADVANCED":
        return {
          className: `${baseStyles} bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200/60 hover:border-rose-300 hover:shadow-sm hover:shadow-rose-100`,
          icon: <AlertTriangle className={iconSize} />,
          text: "Advanced"
        };
      default:
        return {
          className: `${baseStyles} bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200/60 hover:border-gray-300 hover:shadow-sm hover:shadow-gray-100`,
          icon: <HelpCircle className={iconSize} />,
          text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
        };
    }
  };

  const config = getDifficultyConfig(difficulty);

  return (
    <span className={config.className}>
      {showIcon && config.icon}
      <span>{config.text}</span>
    </span>
  );
}
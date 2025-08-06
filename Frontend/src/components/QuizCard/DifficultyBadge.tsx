// components/QuizCard/DifficultyBadge.tsx (Enhanced Version)
interface DifficultyBadgeProps {
  difficulty: string;
  showIcon?: boolean;
}

export default function DifficultyBadge({ difficulty, showIcon = false }: DifficultyBadgeProps) {
  const getDifficultyConfig = (level: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all duration-200 hover:scale-105";
    
    switch (level.toUpperCase()) {
      case "EASY":
      case "BEGINNER":
        return {
          className: `${baseStyles} bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:from-emerald-500/30 hover:to-emerald-500/20`,
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          text: "Beginner"
        };
      case "MEDIUM":
      case "INTERMEDIATE":
        return {
          className: `${baseStyles} bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-700 border-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/20`,
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          text: "Intermediate"
        };
      case "HARD":
      case "ADVANCED":
        return {
          className: `${baseStyles} bg-gradient-to-r from-rose-500/20 to-rose-500/10 text-rose-700 border-rose-500/20 hover:from-rose-500/30 hover:to-rose-500/20`,
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          text: "Advanced"
        };
      default:
        return {
          className: `${baseStyles} bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-700 border-gray-500/20 hover:from-gray-500/30 hover:to-gray-500/20`,
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          ),
          text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
        };
    }
  };

  const config = getDifficultyConfig(difficulty);

  return (
    <span className={config.className}>
      <span className="flex items-center gap-1">
        {showIcon && config.icon}
        {config.text}
      </span>
    </span>
  );
}
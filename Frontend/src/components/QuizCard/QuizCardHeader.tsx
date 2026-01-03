// components/QuizCard/QuizCardHeader.tsx
import { FileText } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";
import TagList from "./TagList";

interface QuizCardHeaderProps {
  title: string;
  difficulty: string;
  tags: string[];
}

export default function QuizCardHeader({ title, difficulty, tags }: QuizCardHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        
        {/* Title and Difficulty */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
              {title}
            </h3>
            <DifficultyBadge difficulty={difficulty} showIcon />
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pl-16">
          <TagList tags={tags} />
        </div>
      )}
    </div>
  );
}
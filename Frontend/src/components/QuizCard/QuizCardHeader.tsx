// components/QuizCard/QuizCardHeader.tsx
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
      {/* Title and Difficulty */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug flex-1">
          {title}
        </h3>
        <DifficultyBadge difficulty={difficulty} showIcon />
      </div>

      {/* Tags */}
      {tags.length > 0 && <TagList tags={tags} />}
    </div>
  );
}
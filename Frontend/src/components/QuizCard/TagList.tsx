// components/QuizCard/TagList.tsx
interface TagListProps {
  tags: string[];
  maxVisible?: number;
}

export default function TagList({ tags, maxVisible = 3 }: TagListProps) {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
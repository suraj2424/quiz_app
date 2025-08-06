// components/SectionHeader.tsx
interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export default function SectionHeader({ badge, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full" />
        {badge}
      </div>

      {/* Title */}
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>

      {/* Description */}
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}
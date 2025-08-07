interface OptionCardProps {
  option: string;
  index: number;
  isSelected: boolean;
  isHidden?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function OptionCard({ 
  option, 
  index, 
  isSelected, 
  isHidden = false, 
  onClick, 
  disabled = false 
}: OptionCardProps) {
  if (isHidden) return null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 transform hover:scale-[1.01] ${
        isSelected
          ? 'bg-purple-50 border-purple-300 shadow-md'
          : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-25 shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 font-semibold text-sm ${
          isSelected 
            ? 'bg-purple-600 border-purple-600 text-white'
            : 'border-gray-300 text-gray-600'
        }`}>
          {String.fromCharCode(65 + index)}
        </div>
        <span className={`${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}>
          {option}
        </span>
      </div>
    </button>
  );
}
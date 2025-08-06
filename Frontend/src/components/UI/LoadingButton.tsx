// components/UI/LoadingButton.tsx
interface LoadingButtonProps {
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export default function LoadingButton({ 
  children, 
  loading, 
  onClick, 
  className = "",
  disabled = false 
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? 'Loading...' : children}
    </button>
  );
}
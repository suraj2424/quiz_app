import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = ''
}: ButtonProps) {
  const variants = {
    primary: 'bg-teal-400 hover:bg-teal-300',
    secondary: 'bg-rose-500 text-white hover:bg-rose-400',
    outline: 'bg-white hover:bg-gray-50',
    ghost: 'bg-amber-400 hover:bg-amber-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        border-4 border-black px-8 py-3 font-black uppercase italic tracking-wider
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-75
        ${className}
      `}
    >
      {children}
    </button>
  );
}
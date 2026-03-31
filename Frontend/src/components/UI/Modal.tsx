import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// Modal logic inside AuthDialog or UI/Modal
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-teal-500/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute -top-4 -right-4 bg-rose-500 text-white border-[3px] border-black p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
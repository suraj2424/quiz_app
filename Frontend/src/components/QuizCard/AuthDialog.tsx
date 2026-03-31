import { LogIn, UserPlus, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
}

export default function AuthDialog({ isOpen, onClose, quizId }: AuthDialogProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleRedirect = (path: string) => {
    onClose();
    navigate(`${path}?type=student`, { state: { returnUrl: `/quiz/id=${quizId}` } });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/10 dark:bg-black/60 backdrop-blur-[4px]">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1a1a2e] border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(20,184,166,0.4)] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Accent Bar */}
        <div className="h-4 bg-teal-500 border-b-[4px] border-black" />
        
        <div className="p-8">
          {/* Icon Box */}
          <div className="w-20 h-20 bg-amber-400 border-[4px] border-black mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
            <Zap className="w-10 h-10 text-black" fill="currentColor" />
          </div>

          <h3 className="text-3xl font-black uppercase italic text-center leading-tight mb-2 text-black dark:text-white">
            HOLD UP!
          </h3>
          <p className="text-center font-bold uppercase text-xs text-gray-500 dark:text-teal-400/80 mb-8 tracking-widest">
            You need an account to track this progress.
          </p>

          <div className="space-y-4">
            {/* Primary Action */}
            <button 
              onClick={() => handleRedirect('/login')}
              className="w-full bg-black dark:bg-teal-500 text-white dark:text-black py-4 border-[3px] border-black font-black uppercase flex items-center justify-center gap-3 hover:bg-teal-500 dark:hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(20,184,166,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <LogIn className="w-5 h-5" /> Sign In
            </button>

            {/* Secondary Action */}
            <button 
              onClick={() => handleRedirect('/register')}
              className="w-full bg-white dark:bg-black text-black dark:text-white py-4 border-[3px] border-black font-black uppercase flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-[#2a2a3e] transition-all"
            >
              <UserPlus className="w-5 h-5" /> Join the Club
            </button>

            {/* Cancel */}
            <button 
              onClick={onClose}
              className="w-full text-gray-400 dark:text-gray-500 font-black uppercase text-[10px] tracking-tighter hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              [ Cancel Mission ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
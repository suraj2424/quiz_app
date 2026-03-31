// components/Header.tsx
import { Link } from "react-router-dom";
import { Brain, Plus, LogIn } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useUser } from "../../contexts/UserContext";
import ThemeToggle from "../common/ThemeToggle";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0D0221] border-b-[3px] border-black dark:border-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-teal-500 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col uppercase italic leading-none">
            <span className="font-black text-2xl tracking-tighter text-black dark:text-white">QUIZIN'</span>
            <span className="text-[10px] font-bold text-rose-500">LEARN SMARTER</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <ThemeToggle />

          <nav className="flex items-center gap-4">
            {user && typeof user === 'object' ? (
              <>
                {user.type === "teacher" && (
                  <Link to="/create-quiz" className="neo-btn hidden md:flex">
                    <Plus className="w-5 h-5" /> <span>Create</span>
                  </Link>
                )}
                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login?type=teacher" className="hidden sm:flex font-black uppercase text-xs text-gray-600 dark:text-gray-400 hover:text-teal-500">
                  Educators
                </Link>
                <Link to="/login?type=student" className="neo-btn bg-rose-500">
                  <LogIn className="w-5 h-5" /> <span>Sign In</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
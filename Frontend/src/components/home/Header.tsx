// components/Header.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Plus, GraduationCap, LogIn } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { UserData } from "./Home";

interface HeaderProps {
  userData: UserData;
  onLogout: () => void;
}

export default function Header({ userData, onLogout }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm shadow-gray-100/50' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                Quizin'
              </span>
              <span className="text-[10px] text-gray-400 font-medium -mt-1 hidden sm:block">
                Learn Smarter
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {userData ? (
              <div className="flex items-center gap-3">
                {/* Teacher Create Button */}
                {userData.type === "teacher" && (
                  <Link
                    to="/create-quiz"
                    className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                    <span className="hidden sm:inline">Create Quiz</span>
                  </Link>
                )}
                
                {/* User Dropdown */}
                <UserDropdown userData={userData} onLogout={onLogout} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Educator Link */}
                <Link
                  to="/login?type=teacher"
                  className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-purple-50"
                >
                  <GraduationCap className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">For Educators</span>
                </Link>
                
                {/* Divider */}
                <div className="hidden sm:block w-px h-6 bg-gray-200" />
                
                {/* Sign In Button */}
                <Link
                  to="/login?type=student"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
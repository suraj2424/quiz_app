// components/Header.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
              Quizin'
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {userData ? (
              <div className="flex items-center gap-4">
                {/* Teacher Create Button */}
                {userData.type === "teacher" && (
                  <Link
                    to="/create-quiz"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Create Quiz</span>
                  </Link>
                )}
                
                {/* User Dropdown */}
                <UserDropdown userData={userData} onLogout={onLogout} />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Tutor Link */}
                <Link
                  to="/login?type=teacher"
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 px-3 py-2"
                >
                  For Educators
                </Link>
                
                {/* Sign In Button */}
                <Link
                  to="/login?type=student"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
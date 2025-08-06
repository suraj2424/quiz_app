// components/UserDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";
import { IoExitOutline, IoAdd, IoChevronDown } from "react-icons/io5";
import { UserData } from "./Home"; // Adjust the import path as necessary
import { FaHistory } from "react-icons/fa";

interface UserDropdownProps {
  userData: UserData;
  onLogout: () => void;
}

export default function UserDropdown({ userData, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-6">
      {userData.type === "teacher" && (
        <Link 
          to="/create-quiz" 
          className="flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                    hover:from-indigo-600 hover:to-purple-600 
                    transition-all duration-200 shadow-md shadow-purple-500/20"
        >
          <IoAdd className="w-5 h-5" />
          <span>Create Quiz</span>
        </Link>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-full
                    hover:bg-gray-100 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                         flex items-center justify-center text-white font-medium">
            {userData.name[0].toUpperCase()}
          </div>
          <span className="text-gray-700">{userData.name}</span>
          <IoChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </button>

        <div className={`absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl 
                        border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-right
                        ${isOpen 
                          ? 'opacity-100 visible scale-100' 
                          : 'opacity-0 invisible scale-95'
                        }`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-900">{userData.email}</p>
          </div>

          <div className="py-2">
            <NavLink 
              to={`/profile/${userData.id}`} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full
                ${isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaUserLarge className="w-4 h-4" />
              Profile
            </NavLink>
            <NavLink 
              to={`/history/${userData.id}`} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full
                ${isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaHistory className="w-4 h-4" />
              History
            </NavLink>
            <NavLink 
              to={`/dashboard/${userData.id}`} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full
                ${isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <MdLeaderboard className="w-4 h-4" />
              Dashboard
            </NavLink>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button 
              onClick={onLogout} 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 
                        hover:bg-red-50 transition-colors w-full text-left"
            >
              <IoExitOutline className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
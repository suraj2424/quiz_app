// components/UserDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, History, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

export default function UserDropdown() {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log('UserDropdown - user:', user);
  console.log('UserDropdown - user type:', typeof user);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // If no valid user object, don't render
  if (!user || typeof user !== 'object') {
    return null;
  }

  // Get display name with fallbacks
  const displayName = user.name || user.full_name || user.email?.split('@')[0] || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || 'No email';
  const userId = user.id || 'user';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 bg-white dark:bg-[#1A0B2E] border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      >
        <div className="w-9 h-9 bg-teal-500 border-r-[3px] border-black flex items-center justify-center text-white font-black uppercase">
          {userInitial}
        </div>
        <span className="font-black uppercase text-xs dark:text-white hidden sm:block">{displayName}</span>
        <ChevronDown className={`w-4 h-4 dark:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#1A0B2E] border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-50">
          <div className="px-4 py-3 border-b-[3px] border-black dark:border-white bg-amber-100 dark:bg-amber-900/40">
            <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">Logged in as</p>
            <p className="text-xs font-bold truncate text-black dark:text-white">{userEmail}</p>
          </div>

          <div className="flex flex-col">
            {[
              { to: `/profile/${userId}`, icon: User, label: 'Profile' },
              { to: `/history/${userId}`, icon: History, label: 'History' },
              { to: `/dashboard/${userId}`, icon: LayoutDashboard, label: 'Dashboard' }
            ].map((link) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic transition-all
                  ${isActive ? 'bg-teal-500 text-white' : 'text-black dark:text-white hover:bg-teal-50 dark:hover:bg-white/5'}
                `}
              >
                <link.icon className="w-4 h-4" /> {link.label}
              </NavLink>
            ))}
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic text-rose-600 border-t-[3px] border-black dark:border-white hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
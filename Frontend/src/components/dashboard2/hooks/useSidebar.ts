// dashboard2/hooks/useSidebar.ts
import { useState, useEffect } from 'react';

interface UseSidebarReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isMobile: boolean;
}

const SIDEBAR_STORAGE_KEY = 'dashboard-sidebar-state';
const MOBILE_BREAKPOINT = 768;

export function useSidebar(): UseSidebarReturn {
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  // Initialize sidebar state from localStorage or default based on screen size
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Default: open on desktop, closed on mobile
    return window.innerWidth >= MOBILE_BREAKPOINT;
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close,
    isMobile
  };
}

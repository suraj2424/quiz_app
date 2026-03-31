// context/UserContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

type UserData = {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  type: "student" | "teacher";
} | null;

type UserContextType = {
  token: string | null;
  user: UserData;
  isDark: boolean;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  toggleTheme: () => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);
  const [user, setUser] = useState<UserData>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Function to refresh user data from token
  const refreshUser = async () => {
    const token = cookies.token;
    console.log('refreshUser - token:', token);
    
    if (!token) {
      console.log('refreshUser - no token, setting user to null');
      setUser(null);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      console.log('refreshUser - calling /api/verify-token');
      
      const response = await fetch(`${backendUrl}/api/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('refreshUser - response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('refreshUser - raw response:', responseData);
        console.log('refreshUser - response type:', typeof responseData);
        
        // Handle different possible response formats
        // The backend might return:
        // 1. { user: {...} } - user object nested
        // 2. {...} - user object directly  
        // 3. { success: true, user: {...} } - with success flag
        // 4. { data: {...} } - wrapped in data field
        
        let processedUser = null;
        
        if (responseData && typeof responseData === 'object') {
          // Try different possible structures
          if (responseData.user && typeof responseData.user === 'object') {
            processedUser = responseData.user;
            console.log('refreshUser - found user in responseData.user');
          } else if (responseData.data && typeof responseData.data === 'object') {
            processedUser = responseData.data;
            console.log('refreshUser - found user in responseData.data');
          } else if (responseData.id || responseData._id || responseData.email) {
            // The response is the user object directly
            processedUser = responseData;
            console.log('refreshUser - response is user object directly');
          } else {
            console.log('refreshUser - could not find user object in response');
            console.log('refreshUser - response keys:', Object.keys(responseData));
          }
        }
        
        if (processedUser && typeof processedUser === 'object') {
          // Normalize the user data
          const normalizedUser = {
            id: processedUser.id || processedUser._id || processedUser.userId || 'unknown',
            name: processedUser.name || processedUser.fullName || processedUser.full_name,
            full_name: processedUser.full_name || processedUser.fullName || processedUser.name,
            email: processedUser.email || processedUser.emailAddress || 'unknown@example.com',
            type: processedUser.type || processedUser.role || 'student',
          };
          
          console.log('refreshUser - normalizedUser:', normalizedUser);
          setUser(normalizedUser);
          
          // Update the cookie with fresh user data
          setCookie('user', normalizedUser, { path: '/', sameSite: 'strict', maxAge: 604800 });
          console.log('refreshUser - user set successfully');
        } else {
          console.log('refreshUser - invalid user data format');
          setUser(null);
        }
      } else {
        // Token is invalid, clear everything
        console.log('refreshUser - token invalid, clearing cookies');
        setUser(null);
        removeCookie('token', { path: '/' });
        removeCookie('user', { path: '/' });
      }
    } catch (error) {
      console.error("refreshUser - failed:", error);
      setUser(null);
    }
  };

  // Initialize user data on mount
  useEffect(() => {
    refreshUser();
  }, [cookies.token]);

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const login = (token: string, userData: UserData) => {
    console.log('login - token:', token);
    console.log('login - userData:', userData);
    
    const options = { path: '/', sameSite: 'strict' as const, maxAge: 604800 };
    setCookie('token', token, options);
    
    // Set user data if provided
    if (userData && typeof userData === 'object') {
      console.log('login - setting user data in state and cookie');
      setUser(userData);
      setCookie('user', userData, options);
    } else {
      console.log('login - no user data provided, will fetch from token');
      // If no user data provided, fetch it from token
      refreshUser();
    }
  };

  const logout = () => {
    setUser(null);
    removeCookie('token', { path: '/' });
    removeCookie('user', { path: '/' });
  };

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <UserContext.Provider value={{ 
      token: cookies.token || null, 
      user, 
      isDark, 
      login, 
      logout, 
      toggleTheme,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

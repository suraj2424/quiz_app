// hooks/useAuth.ts
import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../contexts/TokenContextProvider';

interface UserData {
  name: string;
  email: string;
  id: string;
  type: string;
  avatar?: string;
}

interface UseAuthReturn {
  userData: UserData | null;
  token: string | null;
  removeToken: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { token, removeToken } = useContext(TokenContext);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        
        const response = await fetch(`${backendUrl}/api/verify-token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          setUserData(null);
          removeToken();
          setError('Session expired. Please login again.');
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setUserData(null);
        setError('Failed to verify authentication.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, removeToken]);

  return {
    userData,
    token,
    removeToken,
    isLoading,
    error
  };
};
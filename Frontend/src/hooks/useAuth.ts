// hooks/useAuth.ts
import { useEffect, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';

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
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const { token, user, logout, refreshUser } = useUser();

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user, refreshUser]);

  const userData: UserData | null = useMemo(() => {
    if (!user) return null;
    return {
      name: user.name || user.full_name || 'User',
      email: user.email || '',
      id: user.id || '',
      type: user.type || 'student',
      avatar: undefined,
    };
  }, [user]);

  return {
    userData,
    token,
    logout,
    isLoading: !user && !!token,
    error: null
  };
};
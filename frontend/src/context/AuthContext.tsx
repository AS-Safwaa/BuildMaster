// ─────────────────────────────────────────────────────────
// Auth Context — global authentication state
// ─────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/auth.service';

export type UserRole = 'admin' | 'developer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearSession();
      }
    }
    setIsLoading(false);
  }, []);

  const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data: res } = await authApi.login({ email, password });
    if (res.success) {
      const { user: userData, tokens } = res.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error(res.error || 'Login failed');
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole = 'developer') => {
    const { data: res } = await authApi.register({ name, email, password, role });
    if (res.success) {
      const { user: userData, tokens } = res.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error(res.error || 'Registration failed');
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockLogin, mockGetCurrentUser } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      mockGetCurrentUser(storedUserId)
        .then((user) => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('userId');
          setLoading(false);
        });
    } else {
      // Use a microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem('userId', user.id);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const isAuthenticated = !!user;

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

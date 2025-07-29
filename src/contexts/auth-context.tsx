
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Mock User Type
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockUser: MockUser = {
  uid: 'admin-user-01',
  email: 'admin@vidrieralocal.com',
  displayName: 'Admin Local',
  photoURL: 'https://placehold.co/100x100.png'
};

const AUTH_STORAGE_KEY = 'vidriera_local_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      setLoading(true);
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.error("Failed to parse auth state from localStorage", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(() => {
    setLoading(true);
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        router.push('/admin');
    } catch (error) {
        console.error("Failed to save auth state to localStorage", error);
    } finally {
        setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setLoading(true);
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        router.push('/');
    } catch (error) {
         console.error("Failed to remove auth state from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, [router]);

  const value = {
    user,
    loading,
    signIn,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

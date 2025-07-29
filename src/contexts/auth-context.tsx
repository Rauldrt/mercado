
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state update
      const redirectPath = pathname === '/login' ? '/' : pathname;
      router.push(redirectPath);
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      // setLoading(false) is managed by onAuthStateChanged
    }
  }, [router, pathname]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, [router]);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

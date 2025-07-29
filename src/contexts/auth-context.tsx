
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, GoogleAuthProvider, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          router.push('/admin');
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    
    return () => unsubscribe();
  }, [router]);

  const signIn = useCallback(async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  }, [router]);

  const value = {
    user,
    loading,
    signIn,
    logout
  };
  
  // Render a global loader while auth state is being determined
  if (loading) {
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

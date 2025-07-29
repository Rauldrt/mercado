
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Handle the redirect result from Google
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          // User is signed in via redirect.
          // The onAuthStateChanged listener will handle setting the user state.
          // We can force a redirect here to ensure it happens.
          router.push('/admin');
        }
      })
      .catch((error) => {
        // Handle errors here.
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
        // This is important for when there's no redirect result (e.g., initial page load)
        setLoading(false);
      });
    
    return () => unsubscribe();
  }, [router]);


  // This effect will handle routing logic based on user state and current path
  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isAdminPath = pathname.startsWith('/admin');

    if (user && !isAdminPath) {
      // If user is logged in and not on an admin path, redirect to admin
      router.push('/admin');
    } else if (!user && isAdminPath) {
      // If user is not logged in and tries to access admin, redirect to login
      router.push('/login');
    }

  }, [user, loading, pathname, router]);


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
  
  // Render a global loader ONLY during the initial auth state check.
  // The login page will handle its own loading state for the redirect process.
  if (loading && !user) {
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Ensure Firebase is initialized

interface AuthContextType {
  user: User | null;
  isAuthenticating: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticating(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle errors here, such as displaying a notification to the user.
      setIsAuthenticating(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, []);

  const value = {
    user,
    isAuthenticating,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

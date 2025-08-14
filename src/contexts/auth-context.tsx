
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Ensure Firebase is initialized

interface AuthContextType {
  user: User | null;
  isAuthenticating: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

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

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle setting the user
    } catch(error) {
        console.error("Sign up error:", error);
        setIsAuthenticating(false);
        throw error; // Re-throw to be caught in the component
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticating(false);
      throw error; // Re-throw to be caught in the component
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
    signUpWithEmail,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

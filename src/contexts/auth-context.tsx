
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticating: boolean;
  signOut: () => Promise<void>;
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
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  // This is a mock implementation. In a real app, you'd integrate
  // with Firebase Auth. For now, we'll simulate a logged-in user.
  useEffect(() => {
    const mockUser = {
      uid: 'mock-user-id',
      email: 'admin@mercadoargentino.online',
      displayName: 'Admin',
      photoURL: null
    } as User;

    setUser(mockUser);
    setIsAuthenticating(false);
  }, []);

  const signOut = async () => {
    // In a real app, this would call Firebase's signOut
    setUser(null);
  };

  const value = {
    user,
    isAuthenticating,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

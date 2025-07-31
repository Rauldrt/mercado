
"use client";

import { type ReactNode } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { CartSheet } from './cart/cart-sheet';

// Mock AuthProvider since we removed the real one.
// This prevents the app from crashing while keeping the structure.
const MockAuthProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

// We create a mock useAuth hook to avoid errors in components that use it.
// It will return a null user.
export const useAuth = () => ({
    user: null,
    isAuthenticating: false,
    signInWithGoogle: async () => {},
    signOut: async () => {}
});


export function Providers({ children }: { children: ReactNode }) {
  return (
    <MockAuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster />
          <CartSheet />
        </CartProvider>
      </WishlistProvider>
    </MockAuthProvider>
  );
}

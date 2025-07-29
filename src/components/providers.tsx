
"use client";

import { type ReactNode } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

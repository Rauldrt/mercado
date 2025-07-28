"use client";

import { type ReactNode } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </WishlistProvider>
  );
}

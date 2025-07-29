
"use client";

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNav from '@/components/layout/main-nav';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { SearchDialog } from './search-dialog';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
            </svg>
            <span className="font-bold text-lg font-headline">Ndera-Store</span>
          </Link>
          <div className="hidden md:flex">
             <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <SearchDialog />

          <Button variant="ghost" size="icon" asChild className="relative hidden md:inline-flex">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{wishlistCount}</span>
              )}
              <span className="sr-only">Lista de deseos</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild className="relative hidden md:inline-flex">
            <Link href="/checkout">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                 <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{cartCount}</span>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Link>
          </Button>
          
          <div className="md:hidden">
            {/* The trigger for the old mobile menu is removed. FAB is now the primary mobile navigation trigger. */}
          </div>

        </div>
      </div>
    </header>
  );
}

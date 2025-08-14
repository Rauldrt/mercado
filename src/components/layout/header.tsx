
"use client";

import Link from 'next/link';
import { ShoppingCart, Heart, LogOut, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNav from '@/components/layout/main-nav';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useAuth } from '@/contexts/auth-context';
import { SearchDialog } from './search-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut, isAuthenticating } = useAuth();
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
            </svg>
            <span className="font-bold text-lg font-headline">Mercado Argentino Online</span>
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
          
          <Button variant="ghost" size="icon" className="relative hidden md:inline-flex" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{cartCount}</span>
            )}
            <span className="sr-only">Carrito de compras</span>
          </Button>

          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild>
              <Link href="/login">Ingresar</Link>
            </Button>
          )}

        </div>
      </div>
    </header>
  );
}

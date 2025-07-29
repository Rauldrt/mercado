
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Heart, ShoppingCart, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

export default function MobileFabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const menuItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/#products', label: 'Productos', icon: ShoppingBag },
    { href: '/wishlist', label: 'Deseos', icon: Heart, badge: 'wishlist' },
    { href: '/checkout', label: 'Carrito', icon: ShoppingCart, badge: 'cart' },
  ];

  const getBadgeCount = (badge?: string) => {
    if (badge === 'cart') return cartCount;
    if (badge === 'wishlist') return wishlistCount;
    return 0;
  };

  return (
    <div className="md:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-2xl"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={16}
          className="w-auto border-none bg-transparent p-0 shadow-none"
        >
          <div className="flex flex-col items-end gap-3">
            {menuItems.map((item) => {
              const badgeCount = getBadgeCount(item.badge);
              return (
                <div key={item.href} className="flex items-center gap-3">
                  <div className="rounded-md bg-background px-3 py-2 text-sm font-semibold shadow-md">
                    {item.label}
                  </div>
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="relative h-12 w-12 rounded-full shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      {badgeCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

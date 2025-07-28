"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getProductsByCategory, products } from '@/lib/products';
import { useMemo } from 'react';

interface MainNavProps {
  vertical?: boolean;
  onClose?: () => void;
}

export default function MainNav({ vertical = false, onClose }: MainNavProps) {
  const pathname = usePathname();
  const categories = useMemo(() => {
    const allCategories = products.map(p => p.category);
    return ['Todos', ...Array.from(new Set(allCategories))];
  }, []);


  const navClass = cn(
    'flex items-center space-x-4 lg:space-x-6',
    {
      'flex-col space-x-0 space-y-4 items-start': vertical,
    }
  );

  const linkClass = (href: string) => cn(
    "text-sm font-medium transition-colors hover:text-primary",
    pathname === href ? "text-primary" : "text-muted-foreground",
  );

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <nav className={navClass}>
      <Link href="/" className={linkClass("/")} onClick={handleLinkClick}>
        Inicio
      </Link>
      <Link href="/#products" className={linkClass("/#products")} onClick={handleLinkClick}>
        Productos
      </Link>
      <Link href="/checkout" className={linkClass("/checkout")} onClick={handleLinkClick}>
        Checkout
      </Link>
    </nav>
  );
}

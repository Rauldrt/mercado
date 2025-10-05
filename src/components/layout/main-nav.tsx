
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MainNavProps {
  vertical?: boolean;
  onClose?: () => void;
}

export default function MainNav({ vertical = false, onClose }: MainNavProps) {
  const pathname = usePathname();

  const navClass = cn(
    'flex items-center space-x-4 lg:space-x-6',
    {
      'flex-col space-x-0 space-y-4 items-start': vertical,
    }
  );

  const linkClass = (href: string) => cn(
    "text-sm font-medium transition-colors hover:text-primary",
    pathname.startsWith(href) ? "text-primary" : "text-muted-foreground",
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
      <Link href="/admin/customers" className={linkClass("/admin/customers")} onClick={handleLinkClick}>
        Clientes
      </Link>
      <Link href="/admin/products" className={linkClass("/admin/products")} onClick={handleLinkClick}>
        Productos
      </Link>
    </nav>
  );
}

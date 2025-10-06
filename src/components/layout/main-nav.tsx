
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface MainNavProps {
  vertical?: boolean;
  onClose?: () => void;
}

export default function MainNav({ vertical = false, onClose }: MainNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const ADMIN_EMAIL = 'rauldrt5@gmail.com';

  const linkClass = (href: string) => {
    // A special case for the homepage to avoid it being active for all routes.
    if (href === "/") {
        return cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === href ? "text-primary" : "text-muted-foreground"
        );
    }
    return cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground"
    );
  };

  const navClass = cn(
    "flex items-center space-x-4 lg:space-x-6",
    { "flex-col space-y-4 space-x-0": vertical }
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
        Nuevo Pedido
      </Link>
       <Link href="/admin/orders" className={linkClass("/admin/orders")} onClick={handleLinkClick}>
        Pedidos
      </Link>
      {user?.email === ADMIN_EMAIL && (
        <Link href="/admin/catalog" className={linkClass("/admin/catalog")} onClick={handleLinkClick}>
          Catálogo
        </Link>
      )}
    </nav>
  );
}


"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, Users, Package, FilePlus, Plus, X, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/auth-context';

export default function MobileFabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const ADMIN_EMAIL = 'rauldrt5@gmail.com';

  const menuItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/admin/customers', label: 'Clientes', icon: Users },
    { href: '/admin/products', label: 'Nuevo Pedido', icon: FilePlus },
    { href: '/admin/orders', label: 'Pedidos', icon: ListOrdered },
    ...(user?.email === ADMIN_EMAIL ? [{ href: '/admin/catalog', label: 'Catálogo', icon: Package }] : [])
  ];
  
  if (!user) return null;

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
              return (
                <div key={item.label} className="flex items-center gap-3">
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

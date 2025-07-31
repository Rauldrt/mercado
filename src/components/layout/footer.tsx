
"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Mercado Argentino Online</h3>
            <p className="text-sm">Potenciando el comercio de nuestra comunidad.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li><Link href="/#products" className="hover:underline">Productos</Link></li>
              {user && <li className="md:hidden"><Link href="/admin" className="hover:underline">Admin</Link></li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:underline">Políticas de Envío</Link></li>
              <li><Link href="/returns" className="hover:underline">Política de Devoluciones</Link></li>
              <li><Link href="/contact" className="hover/underline">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Contacto</h4>
            <p className="text-sm">Email: contacto@mercadoargentino.online</p>
            <p className="text-sm">Teléfono: +54 9 11 1234-5678</p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Mercado Argentino Online. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}


"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} App de Preventa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

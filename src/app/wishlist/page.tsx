"use client";

import { useWishlist } from '@/contexts/wishlist-context';
import ProductGrid from '@/components/products/product-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Mi Lista de Deseos</h1>
      {wishlist.length > 0 ? (
        <ProductGrid products={wishlist} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Tu lista de deseos está vacía</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Hacé click en el corazón de los productos que te gusten para guardarlos acá y no perderlos de vista.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Ver productos</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

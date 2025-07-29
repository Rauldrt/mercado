
"use client";

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Agregado al carrito',
      description: `${product.name} ha sido agregado a tu carrito.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Eliminado de la lista de deseos',
        description: `${product.name} ha sido eliminado de tu lista de deseos.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Agregado a la lista de deseos',
        description: `${product.name} ha sido agregado a tu lista de deseos.`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
        <p className="text-lg text-muted-foreground">Vendido por: 
            <Link href={`/vendor/${encodeURIComponent(product.vendor)}`} className="font-semibold text-foreground hover:underline ml-1">
                {product.vendor}
            </Link>
        </p>
        <p className="text-3xl font-bold text-foreground">
          ${new Intl.NumberFormat('es-AR').format(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button size="lg" onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Carrito
        </Button>
        <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
          <Heart className={cn('h-5 w-5', isInWishlist(product.id) && 'fill-primary text-primary')} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Especificaciones Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-medium capitalize text-foreground">{key.replace(/_/g, ' ')}:</span>
                <span className="text-muted-foreground">{value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

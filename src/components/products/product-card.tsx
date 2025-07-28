"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Agregado al carrito",
      description: `${product.name} ha sido agregado a tu carrito.`,
    });
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(product.id, quantityInCart + 1);
  };
  
  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(product.id, quantityInCart - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
       toast({
        title: "Eliminado de la lista de deseos",
        description: `${product.name} ha sido eliminado de tu lista de deseos.`,
      });
    } else {
      addToWishlist(product);
       toast({
        title: "Agregado a la lista de deseos",
        description: `${product.name} ha sido agregado a tu lista de deseos.`,
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
      <Link href={`/product/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="product image"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/product/${product.id}`} className="block">
          <CardTitle className="text-lg font-medium leading-tight mb-2 font-headline hover:text-primary transition-colors">{product.name}</CardTitle>
          <p className="text-2xl font-bold text-foreground">
            ${new Intl.NumberFormat('es-AR').format(product.price)}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {quantityInCart === 0 ? (
            <Button onClick={handleAddToCart} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar
            </Button>
        ) : (
            <div className="flex items-center justify-center w-full gap-2">
                <Button variant="outline" size="icon" onClick={handleDecreaseQuantity}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantityInCart}</span>
                 <Button variant="outline" size="icon" onClick={handleIncreaseQuantity}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        )}

        <Button variant="outline" size="icon" onClick={handleWishlistToggle} className="flex-shrink-0">
          <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-primary text-primary")} />
        </Button>
      </CardFooter>
    </Card>
  );
}

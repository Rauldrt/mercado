"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ZoomIn } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProductRecommendations from './product-recommendations';


interface ProductViewProps {
  product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
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
    <div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
            <Dialog>
                <Carousel className="w-full">
                <CarouselContent>
                    {product.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                        <DialogTrigger asChild>
                            <div className="aspect-square relative group bg-secondary rounded-lg overflow-hidden">
                                <Image
                                src={url}
                                alt={`${product.name} - imagen ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                data-ai-hint="product gallery"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </DialogTrigger>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
                <DialogContent className="max-w-4xl max-h-[90vh]">
                     <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        width={1200}
                        height={1200}
                        className="object-contain w-full h-full"
                        data-ai-hint="product image zoom"
                    />
                </DialogContent>
                </Carousel>
            </Dialog>
        </div>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
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
      </div>
      <div className="mt-12 lg:mt-16">
        <ProductRecommendations currentProduct={product} />
      </div>
    </div>
  );
}

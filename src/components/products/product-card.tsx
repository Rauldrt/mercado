
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, ShoppingCart, Plus, Minus, Package, Box } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const quantityInCartUnit = getItemQuantity(product.id, 'unit');
  const quantityInCartBulk = getItemQuantity(product.id, 'bulk');
  const hasBulkOption = product.unitsPerBulk && product.unitsPerBulk > 1;

  const handleAddToCart = (presentation: 'unit' | 'bulk') => {
    addToCart(product, 1, presentation);
    toast({
      title: "Agregado al carrito",
      description: `${product.name} (${presentation === 'bulk' ? 'Bulto' : 'Unidad'}) ha sido agregado.`,
    });
    setPopoverOpen(false);
  };

  const handleIncreaseQuantity = (presentation: 'unit' | 'bulk') => {
    const currentQuantity = presentation === 'unit' ? quantityInCartUnit : quantityInCartBulk;
    updateQuantity(product.id, currentQuantity + 1, presentation);
  };
  
  const handleDecreaseQuantity = (presentation: 'unit' | 'bulk') => {
    const currentQuantity = presentation === 'unit' ? quantityInCartUnit : quantityInCartBulk;
    updateQuantity(product.id, currentQuantity - 1, presentation);
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

  const renderCartControls = () => {
    if (quantityInCartUnit === 0 && quantityInCartBulk === 0) {
      if (!hasBulkOption) {
        return (
            <Button className="flex-grow" onClick={() => handleAddToCart('unit')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar
            </Button>
        );
      }
      return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button className="flex-grow">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-2">
              <Button variant="ghost" className="justify-start" onClick={() => handleAddToCart('unit')}>
                <Box className="mr-2 h-4 w-4" />
                Agregar por Unidad
              </Button>
              {hasBulkOption && (
                 <Button variant="ghost" className="justify-start" onClick={() => handleAddToCart('bulk')}>
                    <Package className="mr-2 h-4 w-4" />
                    Agregar por Bulto
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    
    return (
        <div className="w-full space-y-2">
            {quantityInCartUnit > 0 && (
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Unidades:</span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleDecreaseQuantity('unit')}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-base w-8 text-center">{quantityInCartUnit}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleIncreaseQuantity('unit')}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
             {quantityInCartBulk > 0 && (
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Bultos:</span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleDecreaseQuantity('bulk')}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-base w-8 text-center">{quantityInCartBulk}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleIncreaseQuantity('bulk')}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
             {((quantityInCartUnit === 0 && hasBulkOption) || (quantityInCartBulk === 0 && hasBulkOption)) && (
                 <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                           <Plus className="mr-2 h-4 w-4" /> Añadir Presentación
                        </Button>
                    </PopoverTrigger>
                     <PopoverContent className="w-56 p-2">
                        <div className="grid gap-2">
                        {quantityInCartUnit === 0 && (
                             <Button variant="ghost" className="justify-start" onClick={() => handleAddToCart('unit')}>
                                <Box className="mr-2 h-4 w-4" />
                                Agregar por Unidad
                            </Button>
                        )}
                        {hasBulkOption && quantityInCartBulk === 0 && (
                            <Button variant="ghost" className="justify-start" onClick={() => handleAddToCart('bulk')}>
                                <Package className="mr-2 h-4 w-4" />
                                Agregar por Bulto
                            </Button>
                        )}
                        </div>
                    </PopoverContent>
                 </Popover>
            )}
        </div>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col group">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            {product.promotionTag && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 z-10"
              >
                {product.promotionTag}
              </Badge>
            )}
            <Button 
                size="icon" 
                onClick={handleWishlistToggle}
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
            >
              <Heart className={cn("h-4 w-4", isInWishlist(product.id) ? "fill-red-500 text-red-500" : "fill-transparent text-white")} />
            </Button>
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="product image"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/product/${product.id}`} className="block">
          <CardTitle className="text-lg font-medium leading-tight mb-1 font-headline hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <Link href={`/vendor/${encodeURIComponent(product.vendor)}`} className="block">
            <CardDescription className="text-sm text-muted-foreground mb-2 hover:text-primary hover:underline">{product.vendor}</CardDescription>
        </Link>
        <div className="flex flex-col">
            <p className="text-2xl font-bold text-foreground">
                ${new Intl.NumberFormat('es-AR').format(product.price)}
                <span className="text-sm font-normal text-muted-foreground"> /unidad</span>
            </p>
            {hasBulkOption && (
                <p className="text-sm font-semibold text-muted-foreground">
                    ${new Intl.NumberFormat('es-AR').format(product.price * (product.unitsPerBulk || 1))}
                    <span className="font-normal"> /bulto ({product.unitsPerBulk} u.)</span>
                </p>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        <div className="w-full">
            {renderCartControls()}
        </div>
      </CardFooter>
    </Card>
  );
}

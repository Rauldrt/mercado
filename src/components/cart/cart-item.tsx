"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/contexts/cart-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.product.imageUrls[0]}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
          data-ai-hint="product image"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary">
              {item.product.name}
            </Link>
            <p className="text-muted-foreground text-sm">
              ${new Intl.NumberFormat('es-AR').format(item.product.price)}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.product.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                className="h-8 w-16"
            />
        </div>
         <p className="text-sm font-medium mt-2">
            Subtotal: ${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}

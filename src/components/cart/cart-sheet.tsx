"use client";

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import CartItem from './cart-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cartItems, totalPrice, clearCart, cartCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Carrito de Compras ({cartCount})</SheetTitle>
          <SheetDescription>
            Los productos en tu carrito se guardarán para tu próxima visita.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="my-4 flex-1 pr-6">
                <div className="flex flex-col gap-6">
                    {cartItems.map(item => (
                        <CartItem key={item.product.id} item={item} />
                    ))}
                </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 sm:flex-col sm:items-stretch sm:gap-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${new Intl.NumberFormat('es-AR').format(totalPrice)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={() => onOpenChange(false)}>
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  Vaciar Carrito
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h3 className="text-xl font-semibold">Tu carrito está vacío</h3>
            <p className="text-muted-foreground">
              Parece que todavía no has agregado nada.
            </p>
            <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/">Seguir comprando</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

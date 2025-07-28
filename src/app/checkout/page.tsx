"use client";

import { useCart } from '@/contexts/cart-context';
import CheckoutForm from '@/components/checkout/checkout-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, totalPrice, cartCount } = useCart();

  const shippingCost = 5000;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Finalizar Compra</h1>
      <div className="grid lg:grid-cols-2 lg:gap-12">
        <div className="lg:order-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Resumen de tu pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image 
                                    src={item.product.imageUrls[0]}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                    data-ai-hint="product thumbnail"
                                />
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">{item.quantity} x ${new Intl.NumberFormat('es-AR').format(item.product.price)}</p>
                            </div>
                            <p className="font-semibold">${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}</p>
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                       <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${new Intl.NumberFormat('es-AR').format(totalPrice)}</span>
                       </div>
                        <div className="flex justify-between">
                            <span>Envío (estimado)</span>
                            <span>${new Intl.NumberFormat('es-AR').format(shippingCost)}</span>
                       </div>
                    </div>
                     <Separator />
                </CardContent>
                <CardFooter className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${new Intl.NumberFormat('es-AR').format(finalTotal)}</span>
                </CardFooter>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-4">
                ¿Necesitas cambiar algo? <Link href="/#products" className="underline hover:text-primary">Volver a la tienda</Link>
            </p>
        </div>
        <div className="lg:order-1 mt-8 lg:mt-0">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCart } from '@/contexts/cart-context';
import CheckoutForm from '@/components/checkout/checkout-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Minus, FileDown, MessageCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CheckoutPage() {
  const { cartItems, totalPrice, cartCount, updateQuantity, clearCart } = useCart();
  const [showPostOrderActions, setShowPostOrderActions] = useState(false);
  const orderSummaryRef = useRef<HTMLDivElement>(null);


  const shippingCost = 5000;
  const finalTotal = totalPrice + shippingCost;
  
  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity - 1);
  };
  
  const handleOrderSuccess = () => {
    setShowPostOrderActions(true);
  };

  const handleDownloadPdf = () => {
    const input = orderSummaryRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resumen-pedido.pdf');
        clearCart();
        setShowPostOrderActions(false);
      });
    }
  };

  const handleShareWhatsApp = () => {
    let message = '¡Hola! Te comparto el resumen de mi pedido:\n\n';
    cartItems.forEach(item => {
      message += `*${item.product.name}* (x${item.quantity}) - $${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}\n`;
    });
    message += `\nSubtotal: $${new Intl.NumberFormat('es-AR').format(totalPrice)}`;
    message += `\nEnvío: $${new Intl.NumberFormat('es-AR').format(shippingCost)}`;
    message += `\n*Total: $${new Intl.NumberFormat('es-AR').format(finalTotal)}*`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setShowPostOrderActions(false);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Finalizar Compra</h1>
      <div className="grid lg:grid-cols-2 lg:gap-12">
        <div className="lg:order-2">
            <Card ref={orderSummaryRef} className="p-4">
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
                            </div>
                            <div className="flex-grow space-y-1">
                                <p className="font-medium">{item.product.name}</p>
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}>
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
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
            {showPostOrderActions && cartItems.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="font-headline">Pedido Confirmado</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                   <p className="text-muted-foreground text-sm">Tu pedido ha sido recibido. ¿Qué te gustaría hacer ahora?</p>
                   <Button onClick={handleDownloadPdf} size="lg">
                     <FileDown className="mr-2" />
                     Descargar Resumen (PDF)
                   </Button>
                   <Button onClick={handleShareWhatsApp} variant="secondary" size="lg">
                     <MessageCircle className="mr-2" />
                     Compartir por WhatsApp
                   </Button>
                </CardContent>
              </Card>
            )}
            <p className="text-center text-sm text-muted-foreground mt-4">
                ¿Necesitas cambiar algo? <Link href="/" className="underline hover:text-primary">Volver a la tienda</Link>
            </p>
        </div>
        <div className="lg:order-1 mt-8 lg:mt-0">
          <CheckoutForm onOrderSuccess={handleOrderSuccess} isSubmitDisabled={showPostOrderActions} />
        </div>
      </div>
    </div>
  );
}

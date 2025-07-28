
"use client";

import { useCart } from '@/contexts/cart-context';
import CheckoutForm from '@/components/checkout/checkout-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Minus, FileDown, MessageCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CheckoutPage() {
  const { cartItems, totalPrice, cartCount, updateQuantity, clearCart } = useCart();
  const [showPostOrderActions, setShowPostOrderActions] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const orderSummaryRef = useRef<HTMLDivElement>(null);


  const shippingCost = 5000;
  const finalTotal = totalPrice + shippingCost;
  
  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity - 1);
  };
  
  const handleOrderSuccess = (data: any) => {
    setCustomerInfo(data);
    setShowPostOrderActions(true);
    clearCart();
  };

  const handleDownloadPdf = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resumen-pedido.pdf');
        
        // Opcional: limpiar el carrito y ocultar botones después de la descarga
        // clearCart();
        // setShowPostOrderActions(false);
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
  };

    // Since the cart is cleared on success, we need to handle the case where cartItems is empty
    // but we still want to show the summary for PDF/WhatsApp. We can use a state to hold the items
    // at the moment of the order.
    const [orderedItems, setOrderedItems] = useState([]);
    const [orderedTotalPrice, setOrderedTotalPrice] = useState(0);

    useEffect(() => {
        if (showPostOrderActions) {
            setOrderedItems(cartItems);
            setOrderedTotalPrice(totalPrice);
        }
    }, [showPostOrderActions]);

    const itemsToDisplay = showPostOrderActions ? orderedItems : cartItems;
    const totalToDisplay = showPostOrderActions ? orderedTotalPrice : totalPrice;
    const finalTotalToDisplay = totalToDisplay + shippingCost;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Contenido oculto para generar el PDF */}
      <div id="pdf-content" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '20px', backgroundColor: 'white', color: 'black' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #EEE', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ height: '40px', width: '40px', marginRight: '12px' }}>
                    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
                  </svg>
                  <div>
                      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Mercado Argentino Online</h1>
                      <p style={{ margin: '0' }}>soporte@mercadoargentino.com.ar</p>
                  </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>Resumen de Pedido</h2>
                  <p style={{ margin: '0' }}>Pedido #: {(Math.random() * 100000).toFixed(0)}</p>
                  <p style={{ margin: '0' }}>Fecha: {new Date().toLocaleDateString('es-AR')}</p>
              </div>
          </div>
          {customerInfo && (
              <div style={{ marginBottom: '30px', borderBottom: '2px solid #EEE', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Datos del Cliente:</h3>
                  <p style={{ margin: '0' }}><strong>Nombre:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                  <p style={{ margin: '0' }}><strong>Dirección:</strong> {customerInfo.address}, {customerInfo.city}, {customerInfo.zip}</p>
                  <p style={{ margin: '0' }}><strong>Email:</strong> {customerInfo.email}</p>
              </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#EEE' }}>
                  <tr>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #DDD' }}>Producto</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #DDD' }}>Cantidad</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #DDD' }}>Precio Unit.</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #DDD' }}>Subtotal</th>
                  </tr>
              </thead>
              <tbody>
                  {itemsToDisplay.map(item => (
                      <tr key={item.product.id}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #EEE' }}>{item.product.name}</td>
                          <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #EEE' }}>{item.quantity}</td>
                          <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #EEE' }}>${new Intl.NumberFormat('es-AR').format(item.product.price)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #EEE' }}>${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <div style={{ width: '250px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Subtotal:</span>
                      <span>${new Intl.NumberFormat('es-AR').format(totalToDisplay)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Envío:</span>
                      <span>${new Intl.NumberFormat('es-AR').format(shippingCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', borderTop: '2px solid #EEE', paddingTop: '8px' }}>
                      <span>Total:</span>
                      <span>${new Intl.NumberFormat('es-AR').format(finalTotalToDisplay)}</span>
                  </div>
              </div>
          </div>
          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
              <p>Gracias por su compra.</p>
              <p>Este documento no es una factura válida.</p>
          </div>
      </div>


      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Finalizar Compra</h1>
      <div className="grid lg:grid-cols-2 lg:gap-12">
        <div className="lg:order-2">
            <Card ref={orderSummaryRef}>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Resumen de tu pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {itemsToDisplay.map(item => (
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
                                {!showPostOrderActions && (
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}>
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                )}
                            </div>
                            <p className="font-semibold">${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}</p>
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                       <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${new Intl.NumberFormat('es-AR').format(totalToDisplay)}</span>
                       </div>
                        <div className="flex justify-between">
                            <span>Envío (estimado)</span>
                            <span>${new Intl.NumberFormat('es-AR').format(shippingCost)}</span>
                       </div>
                    </div>
                     <Separator />
                </CardContent>
                <CardFooter className="pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${new Intl.NumberFormat('es-AR').format(finalTotalToDisplay)}</span>
                </CardFooter>
            </Card>
            {showPostOrderActions && (
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
          <CheckoutForm onOrderSuccess={handleOrderSuccess} isSubmitDisabled={showPostOrderActions || cartCount === 0} />
        </div>
      </div>
    </div>
  );
}

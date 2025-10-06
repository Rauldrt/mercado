
"use client";

import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import CheckoutForm from '@/components/checkout/checkout-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { updateCustomer, getCustomerById } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import type { Customer, CartItem } from '@/lib/types';
import type { z } from 'zod';
import type { checkoutFormSchema } from '@/components/checkout/checkout-form';

export default function CheckoutPage() {
  const { cartItems, totalPrice, cartCount, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [showPostOrderActions, setShowPostOrderActions] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Partial<Customer> | null>(null);
  
  // State to hold the order details at the moment of purchase
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderedTotalPrice, setOrderedTotalPrice] = useState(0);
  const [orderComment, setOrderComment] = useState('');
  const [orderDetailsForPdf, setOrderDetailsForPdf] = useState<{orderId: string, date: string} | null>(null);

  const shippingCost = 0; // Removed shipping cost as requested
  
  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity - 1);
  };
  
  const handleOrderSuccess = async (data: z.infer<typeof checkoutFormSchema>) => {
    const orderId = uuidv4();
    const orderDate = new Date().toISOString();
    
    // Create snapshots of the order details right away
    const currentCartItems = [...cartItems];
    const currentTotalPrice = totalPrice;
    const currentOrderComment = data.orderComment || '';
    
    setOrderedItems(currentCartItems);
    setOrderedTotalPrice(currentTotalPrice);
    setOrderComment(currentOrderComment);
    setOrderDetailsForPdf({ orderId, date: orderDate });
    
    try {
      // Fetch the selected customer to get their full data
      const selectedCustomer = await getCustomerById(data.customerId);
      if (!selectedCustomer) {
        console.error("Selected customer not found!");
        return;
      }
      setCustomerInfo(selectedCustomer);

      // Append the new order to the customer's purchase history
      const newPurchase = {
        orderId: orderId,
        date: orderDate,
        total: currentTotalPrice + shippingCost,
        items: currentCartItems, // Ensure items are included
        orderComment: currentOrderComment,
      };

      const updatedHistory = [...(selectedCustomer.purchaseHistory || []), newPurchase];
      
      await updateCustomer(selectedCustomer.id, { purchaseHistory: updatedHistory });
      
      console.log(`Order saved for customer ID: ${selectedCustomer.id}`);

      setShowPostOrderActions(true);
      clearCart();

    } catch (error) {
      console.error("Failed to save order:", error);
    }
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
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!customerInfo) return;

    const finalTotalForShare = orderedTotalPrice + shippingCost;
    let message = `¡Hola ${customerInfo.firstName}! Te comparto el resumen de tu pedido:\n\n`;
    orderedItems.forEach(item => {
      message += `*${item.product.name}* (${item.quantity} ${item.presentation === 'bulk' ? 'Bulto(s)' : 'Unidad(es)'}) - $${new Intl.NumberFormat('es-AR').format(item.unitPrice * item.quantity)}\n`;
    });
    if (orderComment) {
      message += `\n_Comentario del pedido: ${orderComment}_\n`;
    }
    message += `\nSubtotal: $${new Intl.NumberFormat('es-AR').format(orderedTotalPrice)}`;
    
    if (shippingCost > 0) {
        message += `\nEnvío: $${new Intl.NumberFormat('es-AR').format(shippingCost)}`;
    }
    
    message += `\n*Total: $${new Intl.NumberFormat('es-AR').format(finalTotalForShare)}*`;
    
    message += `\n\n*Datos de Envío:*`;
    message += `\nNombre: ${customerInfo.firstName} ${customerInfo.lastName}`;
    message += `\nDirección: ${customerInfo.address}, ${customerInfo.city}`;

    if (customerInfo.gpsLocation) {
        const [lat, lng] = customerInfo.gpsLocation.split(',').map(s => s.trim());
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        message += `\nUbicación: ${mapsLink}`;
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Determine which data to display based on the checkout state
  const itemsToDisplay = showPostOrderActions ? orderedItems : cartItems;
  const totalToDisplay = showPostOrderActions ? orderedTotalPrice : totalPrice;
  const finalTotalToDisplay = totalToDisplay + shippingCost;

  // This effect ensures we have a stable order ID and date for the PDF *after* the order is successful.
  useEffect(() => {
    if (orderDetailsForPdf) {
      // Logic that needs to run after orderDetailsForPdf is set can go here.
      // For example, if you wanted to auto-trigger a download, which we don't.
    }
  }, [orderDetailsForPdf]);


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Contenido oculto para generar el PDF. Usará el estado `orderedItems` que es estable post-compra. */}
      <div id="pdf-content" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '20px', backgroundColor: 'white', color: 'black' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #EEE', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ height: '40px', width: '40px', marginRight: '12px' }}>
                    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
                  </svg>
                  <div>
                      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Mercado Argentino Online</h1>
                      <p style={{ margin: '0' }}>soporte@mercadoargentino.online</p>
                  </div>
              </div>
              {orderDetailsForPdf && (
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>Resumen de Pedido</h2>
                    <p style={{ margin: '0' }}>Pedido #: {orderDetailsForPdf.orderId.slice(0, 8)}</p>
                    <p style={{ margin: '0' }}>Fecha: {new Date(orderDetailsForPdf.date).toLocaleDateString('es-AR')}</p>
                </div>
              )}
          </div>
          {customerInfo && (
              <div style={{ marginBottom: '30px', borderBottom: '2px solid #EEE', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Datos del Cliente:</h3>
                  <p style={{ margin: '0' }}><strong>Nombre:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                  <p style={{ margin: '0' }}><strong>Dirección:</strong> {customerInfo.address}, {customerInfo.city}, {customerInfo.zip}</p>
                  <p style={{ margin: '0' }}><strong>Email:</strong> {customerInfo.email}</p>
              </div>
          )}
          {orderComment && (
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #EEE' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Comentario del Pedido:</h3>
                <p style={{ margin: '0', fontStyle: 'italic' }}>{orderComment}</p>
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
                  {orderedItems.map(item => (
                      <tr key={item.product.id}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #EEE' }}>
                            {item.product.name}
                            <span style={{ color: '#666', fontSize: '12px' }}> ({item.presentation === 'bulk' ? 'Bulto' : 'Unidad'})</span>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #EEE' }}>{item.quantity}</td>
                          <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #EEE' }}>${new Intl.NumberFormat('es-AR').format(item.unitPrice)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #EEE' }}>${new Intl.NumberFormat('es-AR').format(item.unitPrice * item.quantity)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <div style={{ width: '250px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Subtotal:</span>
                      <span>${new Intl.NumberFormat('es-AR').format(orderedTotalPrice)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Envío:</span>
                        <span>${new Intl.NumberFormat('es-AR').format(shippingCost)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', borderTop: '2px solid #EEE', paddingTop: '8px' }}>
                      <span>Total:</span>
                      <span>${new Intl.NumberFormat('es-AR').format(orderedTotalPrice + shippingCost)}</span>
                  </div>
              </div>
          </div>
          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
              <p>Gracias por su compra.</p>
              <p>Este documento no es una factura válida.</p>
          </div>
      </div>


      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Cargar Pedido</h1>
      <div className="grid lg:grid-cols-2 lg:gap-12">
        <div className="lg:order-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Resumen de pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {itemsToDisplay.map(item => (
                        <div key={`${item.product.id}-${item.presentation}`} className="space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
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
                                    <p className="text-sm text-muted-foreground capitalize">Presentación: {item.presentation === 'bulk' ? 'Bulto' : 'Unidad'}</p>
                                    {!showPostOrderActions && cartCount > 0 && (
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
                                    {showPostOrderActions && (
                                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                    )}
                                </div>
                                <p className="font-semibold">${new Intl.NumberFormat('es-AR').format(item.unitPrice * item.quantity)}</p>
                            </div>
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                       <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${new Intl.NumberFormat('es-AR').format(totalToDisplay)}</span>
                       </div>
                        {shippingCost > 0 && (
                           <div className="flex justify-between">
                                <span>Envío (estimado)</span>
                                <span>${new Intl.NumberFormat('es-AR').format(shippingCost)}</span>
                           </div>
                        )}
                    </div>
                     <Separator />
                     {orderComment && showPostOrderActions && (
                        <div className="space-y-1">
                            <p className="font-medium">Comentario del Pedido:</p>
                            <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">{orderComment}</p>
                        </div>
                     )}
                </CardContent>
                <CardFooter className="pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${new Intl.NumberFormat('es-AR').format(finalTotalToDisplay)}</span>
                </CardFooter>
            </Card>
             {cartCount > 0 && !showPostOrderActions && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                    ¿Necesitas cambiar algo? <Link href="/admin/products" className="underline hover:text-primary">Volver al catálogo</Link>
                </p>
            )}
        </div>
        <div className="lg:order-1 mt-8 lg:mt-0">
          <CheckoutForm 
            onOrderSuccess={handleOrderSuccess} 
            isSubmitDisabled={showPostOrderActions || cartCount === 0}
            showPostOrderActions={showPostOrderActions}
            onDownloadPdf={handleDownloadPdf}
            onShareWhatsApp={handleShareWhatsApp}
          />
        </div>
      </div>
    </div>
  );
}

    

    

"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { FileDown, MessageCircle, Loader2 } from 'lucide-react';
import { getCustomers } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '../ui/textarea';

export const checkoutFormSchema = z.object({
  customerId: z.string().min(1, { message: 'Debes seleccionar un cliente.' }),
  orderComment: z.string().optional(),
  paymentMethod: z.enum(['digital_wallet', 'credit_card', 'cash'], {
    required_error: "Debes seleccionar un método de pago."
  }),
});


interface CheckoutFormProps {
    onOrderSuccess: (data: z.infer<typeof checkoutFormSchema>) => void;
    isSubmitDisabled?: boolean;
    showPostOrderActions: boolean;
    onDownloadPdf: () => void;
    onShareWhatsApp: () => void;
}

export default function CheckoutForm({ 
    onOrderSuccess, 
    isSubmitDisabled = false,
    showPostOrderActions,
    onDownloadPdf,
    onShareWhatsApp
}: CheckoutFormProps) {
  const { toast } = useToast();
  const { cartItems } = useCart();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerId: '',
      orderComment: '',
    },
  });

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const fetchedCustomers = await getCustomers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers for checkout:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los clientes.",
        });
      } finally {
        setLoadingCustomers(false);
      }
    }
    fetchCustomers();
  }, [toast]);


  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    if (cartItems.length === 0 && !showPostOrderActions) {
        toast({
            title: "Tu carrito está vacío",
            description: "Agrega productos al carrito antes de continuar.",
            variant: "destructive",
        });
        return;
    }
    
    console.log('Simulating order submission:', values);
    toast({
      title: "¡Pedido Cargado!",
      description: "El pedido ha sido procesado exitosamente.",
    });
    onOrderSuccess(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader><CardTitle className="font-headline">Asignar Pedido a Cliente</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Seleccionar Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCustomers || showPostOrderActions}>
                            <FormControl>
                            <SelectTrigger>
                                {loadingCustomers ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                <SelectValue placeholder="Elige un cliente de la lista..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {customers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                {`${customer.firstName} ${customer.lastName}`}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="orderComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios del Pedido (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Añadir notas sobre el pedido, la entrega, etc."
                          className="resize-none"
                          disabled={showPostOrderActions}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Confirmar Pedido</CardTitle>
                <CardDescription>Selecciona el método de pago y confirma el pedido del cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-semibold">Método de Pago</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2 pt-2"
                                    disabled={showPostOrderActions}
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="digital_wallet" /></FormControl>
                                        <FormLabel className="font-normal">Billetera Digital</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="credit_card" /></FormControl>
                                        <FormLabel className="font-normal">Tarjeta de Crédito / Débito</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="cash" /></FormControl>
                                        <FormLabel className="font-normal">Contado Efectivo</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        {!showPostOrderActions ? (
                             <Button type="submit" className="w-full" size="lg" disabled={isSubmitDisabled}>
                                Guardar Pedido
                             </Button>
                        ) : (
                            <div className="rounded-md border bg-green-50 border-green-200 p-4 text-center">
                                <h3 className="font-semibold text-green-800">¡Pedido Confirmado!</h3>
                                <p className="text-sm text-green-700 mt-1 mb-4">El pedido se ha guardado.</p>
                                <div className="flex justify-center gap-3">
                                    <Button onClick={onDownloadPdf} size="icon" variant="outline" aria-label="Descargar PDF">
                                        <FileDown />
                                    </Button>
                                    <Button onClick={onShareWhatsApp} size="icon" variant="outline" aria-label="Compartir por WhatsApp">
                                        <MessageCircle />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
      </form>
    </Form>
  );
}

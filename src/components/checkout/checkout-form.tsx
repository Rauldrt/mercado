"use client";

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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  firstName: z.string().min(2, { message: 'Nombre muy corto.' }),
  lastName: z.string().min(2, { message: 'Apellido muy corto.' }),
  address: z.string().min(5, { message: 'Dirección muy corta.' }),
  city: z.string().min(3, { message: 'Ciudad muy corta.' }),
  zip: z.string().min(4, { message: 'Código postal inválido.' }),
  paymentMethod: z.enum(['digital_wallet', 'credit_card', 'cash'], {
    required_error: "Debes seleccionar un método de pago."
  }),
  createAccount: z.boolean().default(false).optional(),
});

interface CheckoutFormProps {
    onOrderSuccess: () => void;
    isSubmitDisabled?: boolean;
}

export default function CheckoutForm({ onOrderSuccess, isSubmitDisabled = false }: CheckoutFormProps) {
    const { toast } = useToast();
    const { cartItems } = useCart();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zip: '',
      createAccount: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (cartItems.length === 0) {
        toast({
            title: "Tu carrito está vacío",
            description: "Agrega productos a tu carrito antes de continuar.",
            variant: "destructive",
        });
        return;
    }
    
    console.log('Simulating order submission:', values);
    toast({
      title: "¡Pedido Recibido!",
      description: "Tu compra ha sido procesada exitosamente. Gracias por confiar en nosotros.",
    });
    form.reset();
    onOrderSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader><CardTitle className="font-headline">Información de Contacto y Envío</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="tu@email.com" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Juan" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Apellido</FormLabel><FormControl><Input placeholder="Pérez" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input placeholder="Av. Corrientes 1234" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input placeholder="CABA" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem><FormLabel>Código Postal</FormLabel><FormControl><Input placeholder="C1043AAV" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="createAccount" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Crear una cuenta para futuras compras (opcional)</FormLabel>
                        </div>
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="font-headline">Método de Pago</CardTitle></CardHeader>
            <CardContent>
                 <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="digital_wallet" /></FormControl>
                                <FormLabel className="font-normal">Billetera Digital (Mercado Pago, etc.)</FormLabel>
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
            </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitDisabled}>
          {isSubmitDisabled ? 'Pedido Realizado' : 'Pagar y Realizar Pedido'}
        </Button>
      </form>
    </Form>
  );
}

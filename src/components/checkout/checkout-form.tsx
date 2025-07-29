
"use client";

import { useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { FileDown, MessageCircle, MapPin } from 'lucide-react';

export const checkoutFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  firstName: z.string().min(2, { message: 'Nombre muy corto.' }),
  lastName: z.string().min(2, { message: 'Apellido muy corto.' }),
  address: z.string().min(5, { message: 'Dirección muy corta.' }),
  city: z.string().min(3, { message: 'Ciudad muy corta.' }),
  zip: z.string().min(4, { message: 'Código postal inválido.' }),
  phoneNumber: z.string().optional(),
  gpsLocation: z.string().optional(),
  paymentMethod: z.enum(['digital_wallet', 'credit_card', 'cash'], {
    required_error: "Debes seleccionar un método de pago."
  }),
  createAccount: z.boolean().default(false).optional(),
});

type ShippingInfo = Omit<z.infer<typeof checkoutFormSchema>, 'paymentMethod' | 'createAccount'>;

interface CheckoutFormProps {
    onOrderSuccess: (data: z.infer<typeof checkoutFormSchema>) => void;
    isSubmitDisabled?: boolean;
    showPostOrderActions: boolean;
    onDownloadPdf: () => void;
    onShareWhatsApp: () => void;
}

const LOCAL_STORAGE_KEY = 'shippingInfo';

export default function CheckoutForm({ 
    onOrderSuccess, 
    isSubmitDisabled = false,
    showPostOrderActions,
    onDownloadPdf,
    onShareWhatsApp
}: CheckoutFormProps) {
  const { toast } = useToast();
  const { cartItems } = useCart();

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zip: '',
      phoneNumber: '',
      gpsLocation: '',
      createAccount: false,
    },
  });

  useEffect(() => {
    try {
        const savedInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedInfo) {
            const parsedInfo: ShippingInfo = JSON.parse(savedInfo);
            form.reset({ ...form.getValues(), ...parsedInfo });
        }
    } catch (error) {
        console.error("Failed to load shipping info from localStorage", error);
    }
  }, [form]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          form.setValue('gpsLocation', locationString, { shouldValidate: true });
          toast({
            title: 'Ubicación Obtenida',
            description: 'Tu ubicación GPS ha sido registrada.',
          });
        },
        (error) => {
          console.error("Error getting location", error);
          toast({
            variant: "destructive",
            title: 'Error de Ubicación',
            description: 'No se pudo obtener la ubicación. Por favor, habilita los permisos en tu navegador.',
          });
        }
      );
    } else {
       toast({
        variant: "destructive",
        title: 'GPS no soportado',
        description: 'Tu navegador no soporta la geolocalización.',
      });
    }
  };

  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    if (cartItems.length === 0 && !showPostOrderActions) {
        toast({
            title: "Tu carrito está vacío",
            description: "Agrega productos a tu carrito antes de continuar.",
            variant: "destructive",
        });
        return;
    }
    
    try {
        const { paymentMethod, createAccount, ...shippingInfo } = values;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shippingInfo));
    } catch (error) {
        console.error("Failed to save shipping info to localStorage", error);
    }

    console.log('Simulating order submission:', values);
    toast({
      title: "¡Pedido Recibido!",
      description: "Tu compra ha sido procesada exitosamente. Gracias por confiar en nosotros.",
    });
    onOrderSuccess(values);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel>Teléfono (Opcional)</FormLabel><FormControl><Input placeholder="+54 9 11..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                        control={form.control}
                        name="gpsLocation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GPS (Opcional)</FormLabel>
                                <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder="Lat, Long" {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={handleGetLocation} aria-label="Obtener ubicación actual">
                                    <MapPin className="h-4 w-4" />
                                </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField control={form.control} name="createAccount" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Crear una cuenta para futuras compras</FormLabel>
                             <CardDescription>Guarda tu información para la próxima vez.</CardDescription>
                        </div>
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Finalizar Compra</CardTitle>
                <CardDescription>Selecciona tu método de pago y confirma tu pedido.</CardDescription>
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
                                Pagar y Realizar Pedido
                             </Button>
                        ) : (
                            <div className="rounded-md border bg-green-50 border-green-200 p-4 text-center">
                                <h3 className="font-semibold text-green-800">¡Pedido Confirmado!</h3>
                                <p className="text-sm text-green-700 mt-1 mb-4">Gracias por tu compra.</p>
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

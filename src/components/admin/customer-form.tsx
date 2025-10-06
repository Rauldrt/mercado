
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Customer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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
import { MapPin } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, ingrese un email válido.' }),
  address: z.string().min(5, { message: 'La dirección debe tener al menos 5 caracteres.' }),
  city: z.string().min(3, { message: 'La ciudad debe tener al menos 3 caracteres.' }),
  zip: z.string().min(4, { message: 'El código postal debe tener al menos 4 caracteres.' }),
  phoneNumber: z.string().optional(),
  gpsLocation: z.string().optional(),
});

interface CustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Omit<Customer, 'id' | 'purchaseHistory'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      address: customer?.address || '',
      city: customer?.city || '',
      zip: customer?.zip || '',
      phoneNumber: customer?.phoneNumber || '',
      gpsLocation: customer?.gpsLocation || '',
    },
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          form.setValue('gpsLocation', locationString, { shouldValidate: true });
          toast({
            title: 'Ubicación Obtenida',
            description: 'La ubicación GPS ha sido registrada.',
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


  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalCustomerData: Omit<Customer, 'id' | 'purchaseHistory'> & { id?: string } = {
        ...values,
    };
    if (customer?.id) {
        finalCustomerData.id = customer.id;
    }
    onSave(finalCustomerData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl><Input placeholder="Juan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl><Input placeholder="Pérez" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="juan.perez@email.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl><Input placeholder="Av. Corrientes 1234" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl><Input placeholder="CABA" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl><Input placeholder="C1043AAV" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl><Input placeholder="+54 9 11..." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="gpsLocation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ubicación GPS (Opcional)</FormLabel>
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
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar Cliente</Button>
        </div>
      </form>
    </Form>
  );
}

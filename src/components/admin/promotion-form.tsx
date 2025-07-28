
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Promotion } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, ingrese una URL de imagen válida.' }),
  imageHint: z.string().min(2, { message: 'La pista de imagen es requerida.' }),
  link: z.string().min(1, { message: 'El enlace es requerido.' }),
});

interface PromotionFormProps {
  promotion?: Promotion | null;
  onSave: (promotion: Promotion) => void;
  onCancel: () => void;
}

export default function PromotionForm({ promotion, onSave, onCancel }: PromotionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: promotion?.title || '',
      description: promotion?.description || '',
      imageUrl: promotion?.imageUrl || '',
      imageHint: promotion?.imageHint || '',
      link: promotion?.link || '/#products',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalPromotion: Promotion = {
      id: promotion?.id || uuidv4(),
      ...values,
    };
    onSave(finalPromotion);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl><Input placeholder="25% OFF en Calzado" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl><Textarea placeholder="Descripción de la promoción..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen</FormLabel>
              <FormControl><Input placeholder="https://placehold.co/800x400" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pista para IA de la Imagen</FormLabel>
              <FormControl><Input placeholder="shoes sale" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace</FormLabel>
              <FormControl><Input placeholder="/#products" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar Promoción</Button>
        </div>
      </form>
    </Form>
  );
}

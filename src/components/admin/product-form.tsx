
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  price: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  category: z.string().min(2, { message: 'La categoría es requerida.' }),
  stock: z.coerce.number().int().min(0, { message: 'El stock no puede ser negativo.' }),
  imageUrls: z.array(z.object({ value: z.string().url({ message: 'Por favor, ingrese una URL válida.' }) })).min(1, 'Se requiere al menos una imagen.'),
  specifications: z.array(z.object({
    key: z.string().min(1, 'La clave no puede estar vacía.'),
    value: z.string().min(1, 'El valor no puede estar vacío.'),
  })),
  vendor: z.string().min(2, { message: 'El nombre del vendedor es requerido.'}),
});

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'vendorId'> & { vendorId?: string }) => void;
  onCancel: () => void;
}

// Function to transform specifications object to array
const specsToArray = (specs: Record<string, string>) => {
  return Object.entries(specs).map(([key, value]) => ({ key, value }));
};

// Function to transform specifications array to object
const specsToObject = (specs: { key: string; value: string }[]) => {
  return specs.reduce((acc, { key, value }) => {
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      stock: product?.stock || 0,
      imageUrls: product?.imageUrls.map(url => ({ value: url })) || [{ value: '' }],
      specifications: product ? specsToArray(product.specifications) : [{ key: '', value: '' }],
      vendor: product?.vendor || user?.displayName || '',
    },
  });

  const { fields: imageUrlFields, append: appendImageUrl, remove: removeImageUrl } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalProduct = {
      id: product?.id || uuidv4(),
      ...values,
      vendorId: user!.uid,
      imageUrls: values.imageUrls.map(url => url.value),
      specifications: specsToObject(values.specifications),
    };
    onSave(finalProduct);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl><Input placeholder="Zapatillas Urbanas" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl><Input type="number" placeholder="89999.99" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl><Textarea placeholder="Descripción detallada del producto..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl><Input placeholder="Calzado" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl><Input type="number" placeholder="50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Vendedor/Tienda</FormLabel>
              <FormControl><Input placeholder="Mi Tienda" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Image URLs */}
        <div className="space-y-4 rounded-md border p-4">
          <FormLabel>URLs de Imágenes</FormLabel>
          {imageUrlFields.map((field, index) => (
             <FormField
                key={field.id}
                control={form.control}
                name={`imageUrls.${index}.value`}
                render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                         <FormControl>
                            <Input placeholder="https://placehold.co/600x600" {...field} />
                         </FormControl>
                         {imageUrlFields.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeImageUrl(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                         )}
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
          ))}
          <Button type="button" size="sm" variant="outline" onClick={() => appendImageUrl({ value: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir URL de Imagen
          </Button>
        </div>

        {/* Specifications */}
        <div className="space-y-4 rounded-md border p-4">
           <FormLabel>Especificaciones</FormLabel>
           {specFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
                <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                             <FormLabel className={cn(index !== 0 && "sr-only")}>Clave</FormLabel>
                             <FormControl><Input placeholder="Material" {...field} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                             <FormLabel className={cn(index !== 0 && "sr-only")}>Valor</FormLabel>
                             <FormControl><Input placeholder="Cuero" {...field} /></FormControl>
                              <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="mt-8" type="button" variant="destructive" size="icon" onClick={() => removeSpec(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
           ))}
            <Button type="button" size="sm" variant="outline" onClick={() => appendSpec({ key: '', value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Especificación
            </Button>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar Producto</Button>
        </div>
      </form>
    </Form>
  );
}


"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { setProductWithId, getProductById } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Upload, Loader2 } from 'lucide-react';

const formSchema = z.object({
  csvFile: z
    .custom<FileList>()
    .transform((file) => file[0])
    .refine((file) => file, 'El archivo CSV es requerido.')
    .refine((file) => file?.type === 'text/csv', 'El archivo debe ser un CSV.'),
});

// Zod schema for a single product row in the CSV
const productRowSchema = z.object({
  id: z.string().min(1, { message: 'El "id" es requerido.' }),
  name: z.string().min(1, { message: 'El "name" es requerido.' }),
  price: z.coerce.number().positive({ message: 'El "price" debe ser un número positivo.' }),
  description: z.string().min(1, { message: 'La "description" es requerida.' }),
  category: z.string().min(1, { message: 'La "category" es requerida.' }),
});


interface ProductCsvImporterProps {
  onImportSuccess: () => void;
}

export default function ProductCsvImporter({ onImportSuccess }: ProductCsvImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsImporting(true);
    try {
      const results = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(data.csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      const requiredHeaders = ['id', 'name', 'price', 'description', 'category'];
      const fileHeaders = results.meta.fields || [];
      const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`El archivo CSV no contiene las siguientes columnas requeridas: ${missingHeaders.join(', ')}`);
      }
      
      let importedCount = 0;
      let errorCount = 0;
      
      const productPromises = results.data.map(async (row, index) => {
        if (!row.id) {
            // Skip empty rows or rows without an ID
            return;
        }
        try {
          // Validate each row against the schema
          const parsedRow = productRowSchema.parse(row);
          const { id, ...csvData } = parsedRow;

          const existingProduct = await getProductById(id);

          let productPayload: Partial<Omit<Product, 'id'>>;

          if (existingProduct) {
            // If product exists, just pass the data from the CSV to be updated.
            productPayload = csvData;
          } else {
            // If it's a new product, create a full object with default values.
            productPayload = {
              ...csvData,
              stock: 0,
              imageUrls: ['https://placehold.co/600x600'],
              specifications: {},
              vendor: 'Tienda Principal',
              vendorId: 'admin',
            };
          }
          
          // Use setProductWithId which will create or merge
          await setProductWithId(id, productPayload);
          importedCount++;

        } catch (e) {
          errorCount++;
          console.error(`Error en la fila ${index + 2}:`, e);
        }
      });
      
      await Promise.all(productPromises);
      
      toast({
        title: 'Importación Completada',
        description: `${importedCount} productos importados/actualizados, ${errorCount} filas con errores.`,
      });

      if (importedCount > 0) {
        onImportSuccess();
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de Importación',
        description: error.message || 'No se pudo procesar el archivo CSV.',
      });
    } finally {
      setIsImporting(false);
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end mb-4">
            <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Importar desde CSV
            </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Productos Masivamente</DialogTitle>
          <DialogDescription>
            Sube un archivo .csv con los productos. Asegúrate de que las columnas sean: 
            `id`, `name`, `price`, `description`, y `category`. El resto de los datos podrás completarlos luego.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="csvFile"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Archivo CSV</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".csv" onChange={(e) => onChange(e.target.files)} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : 'Iniciar Importación' }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


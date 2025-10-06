
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { ZodError, z } from 'zod';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { setProductWithId, getProductById } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  unitsPerBulk: z.coerce.number().min(1, { message: 'El campo "unitsPerBulk" debe ser al menos 1.'}),
  imageUrls: z.string().url({ message: 'El campo "imageUrls" debe ser una URL válida.' }).optional().or(z.literal('')),
});


interface ProductCsvImporterProps {
  onImportSuccess: () => void;
}

interface ImportError {
  row: number;
  message: string;
}

export default function ProductCsvImporter({ onImportSuccess }: ProductCsvImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsImporting(true);
    setImportErrors([]);
    
    try {
      const results = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(data.csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      const requiredHeaders = ['id', 'name', 'price', 'description', 'category', 'unitsPerBulk'];
      const fileHeaders = results.meta.fields || [];
      const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`El archivo CSV no contiene las siguientes columnas requeridas: ${missingHeaders.join(', ')}`);
      }
      
      let importedCount = 0;
      const errors: ImportError[] = [];
      
      const productPromises = results.data.map(async (row, index) => {
        if (!row.id) {
            return;
        }
        try {
          // Pre-process price to handle comma decimal separators
          if (row.price && typeof row.price === 'string') {
            row.price = row.price.replace(',', '.');
          }
          if (row.unitsPerBulk && typeof row.unitsPerBulk === 'string') {
            row.unitsPerBulk = row.unitsPerBulk.replace(',', '.');
          }

          const parsedRow = productRowSchema.parse(row);
          const { id, ...csvData } = parsedRow;

          const existingProduct = await getProductById(id);

          let productPayload: Partial<Omit<Product, 'id'>>;

          if (existingProduct) {
            productPayload = {
                ...csvData,
                imageUrls: csvData.imageUrls ? [csvData.imageUrls] : existingProduct.imageUrls,
            };
          } else {
            productPayload = {
              ...csvData,
              stock: 0,
              imageUrls: csvData.imageUrls ? [csvData.imageUrls] : ['https://placehold.co/600x600'],
              specifications: {},
              vendor: 'Tienda Principal',
              vendorId: 'admin',
            };
          }
          
          await setProductWithId(id, productPayload);
          importedCount++;

        } catch (e) {
          const rowIndex = index + 2; // +1 for header row, +1 for 0-based index
          let errorMessage = `Error desconocido.`;
          if (e instanceof ZodError) {
             errorMessage = e.errors.map(err => `${err.path[0]}: ${err.message}`).join(', ');
          } else if (e instanceof Error) {
            errorMessage = e.message;
          }
          errors.push({ row: rowIndex, message: errorMessage });
          console.error(`Error en la fila ${rowIndex}:`, e);
        }
      });
      
      await Promise.all(productPromises);
      
      toast({
        title: 'Importación Completada',
        description: `${importedCount} productos importados/actualizados, ${errors.length} filas con errores.`,
      });

      if (errors.length > 0) {
        setImportErrors(errors);
      } else {
        // Only close if no errors, so user can see the error dialog
        setIsOpen(false);
      }
      
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
      form.reset();
    }
  };

  return (
    <>
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
            Sube un archivo .csv con los productos. Columnas requeridas: 
            `id`, `name`, `price`, `description`, `category`, `unitsPerBulk`. 
            Columna opcional: `imageUrls`.
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

    <Dialog open={importErrors.length > 0} onOpenChange={() => setImportErrors([])}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>Errores de Importación</DialogTitle>
            <DialogDescription>
                Se encontraron los siguientes errores en el archivo CSV. Por favor, corrígelos e intenta de nuevo.
            </DialogDescription>
            </DialogHeader>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Detalles de Errores</AlertTitle>
                <AlertDescription>
                    <div className="max-h-60 overflow-y-auto mt-2">
                    <ul className="space-y-1 font-mono text-xs">
                        {importErrors.map((error, i) => (
                        <li key={i}>
                            <span className="font-bold">Fila {error.row}:</span> {error.message}
                        </li>
                        ))}
                    </ul>
                    </div>
                </AlertDescription>
            </Alert>
            <DialogFooter>
                <DialogClose asChild>
                    <Button onClick={() => setImportErrors([])}>Entendido</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}

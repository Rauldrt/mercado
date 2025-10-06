
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
import { setCustomerWithId, getCustomerById } from '@/lib/firebase';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  csvFile: z
    .custom<FileList>()
    .transform((file) => file[0])
    .refine((file) => file, 'El archivo CSV es requerido.')
    .refine((file) => file?.type === 'text/csv', 'El archivo debe ser un CSV.'),
});

// Zod schema for a single customer row in the CSV
const customerRowSchema = z.object({
  id: z.string().min(1, { message: 'El "id" es requerido y no puede estar vacío.' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // Valida el email solo si no está vacío
  email: z.string().email({ message: 'El "email" debe ser un email válido.' }).optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  phoneNumber: z.string().optional(),
  gpsLocation: z.string().optional(),
});


interface CustomerCsvImporterProps {
  onImportSuccess: () => void;
}

interface ImportError {
  row: number;
  message: string;
}

export default function CustomerCsvImporter({ onImportSuccess }: CustomerCsvImporterProps) {
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
      
      let importedCount = 0;
      const errors: ImportError[] = [];
      
      const customerPromises = results.data.map(async (row, index) => {
        // Skip rows that are completely empty or just have empty values
        if (Object.values(row).every(val => val === '' || val === null)) {
            return;
        }

        try {
          const parsedRow = customerRowSchema.parse(row);
          const { id, ...csvData } = parsedRow;

          // Si el id es inválido o no existe, no procesamos la fila.
          if (!id) {
            errors.push({ row: index + 2, message: 'La columna "id" es requerida y no puede estar vacía.' });
            return;
          }

          const existingCustomer = await getCustomerById(id);

          let customerPayload = { ...csvData };
          
          if (!existingCustomer) {
            Object.assign(customerPayload, { purchaseHistory: [] });
          }
          
          await setCustomerWithId(id, customerPayload);
          importedCount++;

        } catch (e) {
          const rowIndex = index + 2; // +1 for header row, +1 for 0-based index
          let errorMessage = `Error desconocido.`;
          if (e instanceof ZodError) {
             errorMessage = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
          } else if (e instanceof Error) {
            errorMessage = e.message;
          }
          errors.push({ row: rowIndex, message: errorMessage });
          console.error(`Error en la fila ${rowIndex}:`, e);
        }
      });
      
      await Promise.all(customerPromises);
      
      toast({
        title: 'Importación Completada',
        description: `${importedCount} clientes importados/actualizados, ${errors.length} filas con errores.`,
      });

      if (errors.length > 0) {
        setImportErrors(errors);
      } else {
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
                Importar Clientes desde CSV
            </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Clientes Masivamente</DialogTitle>
          <DialogDescription>
            Sube un archivo .csv. La única columna requerida es `id`. Las demás son opcionales: `firstName`, `lastName`, `email`, `address`, `city`, `zip`, `phoneNumber`, `gpsLocation`.
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
                Se encontraron los siguientes errores en el archivo CSV. Las filas con errores no fueron importadas.
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

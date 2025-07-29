
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSetting, updateSetting } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const settingsFormSchema = z.object({
  homepageSubtitle: z.string().min(10, { message: 'El subtítulo debe tener al menos 10 caracteres.' }),
});

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      homepageSubtitle: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const subtitle = await getSetting('homepageSubtitle');
        if (subtitle) {
          form.setValue('homepageSubtitle', subtitle);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las configuraciones." });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [form, toast]);


  async function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    try {
      await updateSetting('homepageSubtitle', values.homepageSubtitle);
      toast({
        title: 'Configuración Guardada',
        description: 'El subtítulo de la página de inicio ha sido actualizado.',
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la configuración." });
    }
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Página de Inicio</CardTitle>
        <CardDescription>Personaliza el contenido de la página principal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="homepageSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo de Bienvenida</FormLabel>
                  <FormControl>
                    <Input placeholder="Explora los productos de tu comunidad..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

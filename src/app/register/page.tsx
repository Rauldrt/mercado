
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const registerFormSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingrese un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export default function RegisterPage() {
  const { user, signUpWithEmail, isAuthenticating } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      await signUpWithEmail(values.email, values.password);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta de administrador ha sido creada. Serás redirigido.",
      });
      // The useEffect will handle the redirect on user state change
    } catch (error: any) {
      console.error("Error signing up", error);
      let description = "Ocurrió un error. Por favor, intente de nuevo.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email ya está en uso. Por favor, intenta con otro.";
      }
      toast({
        variant: "destructive",
        title: "Error de registro",
        description,
      });
    }
  };
  
  if (isAuthenticating || user) {
    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-secondary/50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Crear Cuenta de Administrador</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="admin@tienda.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrarse
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Inicia sesión aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

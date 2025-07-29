
"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);
  
  // Muestra un loader si el usuario ya existe (y está a punto de ser redirigido)
  // o si el proceso de autenticación general está en curso.
  if (loading || user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-muted-foreground">Procesando inicio de sesión...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Bienvenido de vuelta</CardTitle>
          <CardDescription>Inicia sesión para administrar tu vidriera.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="default"
            className="w-full"
            onClick={signIn}
            disabled={loading} // El botón se desactiva mientras carga
          >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LogIn className="mr-2 h-5 w-5" />
            )}
            Iniciar Sesión como Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

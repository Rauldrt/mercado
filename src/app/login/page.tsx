
"use client";

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  
  // The AuthProvider now handles all redirection logic.
  // This page just needs to show the button or a loading state.

  if (loading || user) {
    // If auth state is loading, or if a user is found (and redirection is imminent),
    // show a loader to prevent the user from clicking anything.
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
            disabled={loading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Iniciar Sesión como Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

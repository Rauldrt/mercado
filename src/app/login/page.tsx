
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, isAuthenticating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The useEffect will handle the redirect on user state change
    } catch (error) {
      console.error("Error signing in with Google", error);
      // Here you could show a toast to the user
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
          <CardTitle className="text-2xl font-headline">Acceso Administrador</CardTitle>
          <CardDescription>
            Inicia sesión para gestionar tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full" disabled={isAuthenticating}>
             {isAuthenticating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 8 244 8c66.8 0 126 25.5 169.3 65.5l-69.2 67.2c-23.6-22.5-55.2-35.3-90-35.3-70.5 0-129.2 57.3-129.2 128.2 0 70.9 58.7 128.2 129.2 128.2 79.4 0 119.5-56.2 123.4-86.6H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 42.5z"></path>
                </svg>
             )}
            Ingresar con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

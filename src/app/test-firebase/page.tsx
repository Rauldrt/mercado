
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Intencionadamente pedimos los productos para probar la lectura de Firestore
        const products = await getProducts();
        setProductCount(products.length);
        setStatus('success');
      } catch (e: any) {
        console.error("Firebase connection test failed:", e);
        setError(e.message);
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Prueba de Conexión con Firebase</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Probando conexión con Firestore...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="font-semibold text-xl mt-2">¡Conexión Exitosa!</p>
              <p className="text-muted-foreground text-center">
                Se ha conectado correctamente a Firestore y se han encontrado {productCount} productos en tu colección.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="font-semibold text-xl mt-2">Error de Conexión</p>
              <p className="text-muted-foreground text-center">
                No se pudo conectar a Firebase. Revisa la consola del navegador y la configuración de tu proyecto.
              </p>
              <Card className="bg-destructive/10 border-destructive/20 text-left w-full mt-4">
                  <CardContent className="p-3">
                    <p className="text-sm font-mono text-destructive">{error}</p>
                  </CardContent>
              </Card>
            </>
          )}
           <Button asChild className="mt-6">
                <Link href="/">Volver al Inicio</Link>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Construction } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline mt-4">Función Deshabilitada</CardTitle>
          <CardDescription>El inicio de sesión se encuentra temporalmente deshabilitado. Estamos trabajando en ello.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button asChild>
            <Link href="/">Volver a la Tienda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

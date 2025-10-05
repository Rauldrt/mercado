
"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Users, FilePlus } from "lucide-react";
import Link from 'next/link';

function HomePageContent() {
    const { user, isAuthenticating } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticating && !user) {
            router.push('/login');
        }
    }, [user, isAuthenticating, router]);

    if (isAuthenticating || !user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Verificando tu sesión...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Panel de Preventista</h1>
                <p className="text-muted-foreground mt-2">Bienvenido, {user.email}. Gestiona tus clientes y pedidos desde aquí.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                 <Link href="/admin/customers" passHref>
                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold font-headline">Mis Clientes</h2>
                                <p className="text-muted-foreground text-sm">Ver y gestionar tu cartera de clientes.</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link href="/admin/products" passHref>
                     <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                             <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                <FilePlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold font-headline">Cargar Pedido</h2>
                                <p className="text-muted-foreground text-sm">Crear un nuevo pedido para un cliente.</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default function Home() {
    return <HomePageContent />;
}

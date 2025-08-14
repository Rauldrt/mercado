
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminProductsTable from "@/components/admin/products-table";
import AdminCustomersTable from "@/components/admin/customers-table";
import AdminPromotionsTable from "@/components/admin/promotions-table";
import AdminSettings from "@/components/admin/admin-settings";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function AdminDashboard() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Panel de Administración</h1>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-4 md:w-[800px]">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="promotions">Promociones</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                  Añade, edita o elimina productos de tu tienda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminProductsTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>
                  Visualiza y gestiona la información de tus clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCustomersTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Promociones</CardTitle>
                <CardDescription>
                  Crea y administra las promociones para la página de inicio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPromotionsTable />
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
                <CardDescription>
                  Gestiona las configuraciones globales de tu tienda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

export default AdminDashboard;

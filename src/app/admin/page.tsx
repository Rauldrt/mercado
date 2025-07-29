
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminProductsTable from "@/components/admin/products-table";
import AdminCustomersTable from "@/components/admin/customers-table";
import AdminPromotionsTable from "@/components/admin/promotions-table";

function AdminDashboard() {
  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Panel de Administración</h1>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="promotions">Promociones</TabsTrigger>
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
        </Tabs>
      </div>
  )
}

export default AdminDashboard;

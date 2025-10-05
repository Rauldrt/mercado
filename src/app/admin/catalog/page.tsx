
'use client'

import AdminProductsTable from "@/components/admin/products-table";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react";
import ProductCsvImporter from "@/components/admin/product-csv-importer";

function AdminCatalogPage() {
  const { user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [tableKey, setTableKey] = useState(Date.now()); // State to force re-render

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    }
  }, [user, isAuthenticating, router]);

  const handleImportSuccess = () => {
    // Update the key to force AdminProductsTable to re-fetch products
    setTableKey(Date.now());
  };

  if (isAuthenticating || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Gestión de Catálogo</h1>
            <p className="text-muted-foreground">Añade, edita, elimina o importa masivamente productos de tu catálogo.</p>
        </div>
        <ProductCsvImporter onImportSuccess={handleImportSuccess} />
        <AdminProductsTable key={tableKey} />
      </div>
  )
}

export default AdminCatalogPage;

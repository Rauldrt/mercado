

'use client'

import AdminCustomersTable from "@/components/admin/customers-table";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react";
import CustomerCsvImporter from "@/components/admin/customer-csv-importer";

function AdminCustomersPage() {
  const { user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [tableKey, setTableKey] = useState(Date.now()); // State to force re-render

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    }
  }, [user, isAuthenticating, router]);

  const handleImportSuccess = () => {
    // Update the key to force AdminCustomersTable to re-fetch customers
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
            <h1 className="text-3xl font-bold tracking-tight font-headline">Gestión de Clientes</h1>
            <p className="text-muted-foreground">Añade, edita o importa masivamente la información de tus clientes.</p>
        </div>
        <CustomerCsvImporter onImportSuccess={handleImportSuccess} />
        <AdminCustomersTable key={tableKey} />
      </div>
  )
}

export default AdminCustomersPage;

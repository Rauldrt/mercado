
'use client'

import AdminProductsTable from "@/components/admin/products-table";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Search } from "lucide-react";
import ProductCsvImporter from "@/components/admin/product-csv-importer";
import { getProducts } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";

function AdminCatalogPage() {
  const { user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAndSetProducts = async () => {
    setLoading(true);
    try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
    } catch (error) {
        console.error("Failed to fetch products:", error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    } else if(user) {
        fetchAndSetProducts();
    }
  }, [user, isAuthenticating, router]);

  const handleImportSuccess = () => {
    fetchAndSetProducts();
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.id.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, products]);

  if (isAuthenticating || !user || loading) {
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
        <div className="flex justify-between items-center mb-4 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, ID o descripción..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ProductCsvImporter onImportSuccess={handleImportSuccess} />
        </div>
        <AdminProductsTable products={filteredProducts} onProductUpdate={fetchAndSetProducts} />
      </div>
  )
}

export default AdminCatalogPage;

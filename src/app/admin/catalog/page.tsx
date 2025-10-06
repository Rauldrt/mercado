
'use client'

import AdminProductsTable from "@/components/admin/products-table";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Search, Filter } from "lucide-react";
import ProductCsvImporter from "@/components/admin/product-csv-importer";
import { getProducts } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function AdminCatalogPage() {
  const { user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const ADMIN_EMAIL = 'rauldrt5@gmail.com';


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
    if (!isAuthenticating) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        fetchAndSetProducts();
      }
    }
  }, [user, isAuthenticating, router]);

  const handleImportSuccess = () => {
    fetchAndSetProducts();
  };

  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (visibilityFilter !== 'all') {
      filtered = filtered.filter(p => {
        const isVisible = p.isVisible ?? true;
        return visibilityFilter === 'visible' ? isVisible : !isVisible;
      });
    }

    if (!searchQuery) return filtered;
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.trim() !== '');
    if (searchTerms.length === 0) return filtered;

    return filtered.filter(product => {
        const productText = `
            ${product.name.toLowerCase()} 
            ${product.id.toLowerCase()} 
            ${product.description.toLowerCase()}
        `;
        return searchTerms.every(term => productText.includes(term));
    });
  }, [searchQuery, products, categoryFilter, visibilityFilter]);

  if (isAuthenticating || !user || user.email !== ADMIN_EMAIL || loading) {
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, ID o descripción..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.filter(c => c !== 'all').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Select value={visibilityFilter} onValueChange={(value) => setVisibilityFilter(value as any)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por visibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="visible">Visibles</SelectItem>
                      <SelectItem value="hidden">Ocultos</SelectItem>
                  </SelectContent>
              </Select>
            </div>
        </div>
        <ProductCsvImporter onImportSuccess={handleImportSuccess} />
        <AdminProductsTable products={filteredProducts} onProductUpdate={fetchAndSetProducts} />
      </div>
  )
}

export default AdminCatalogPage;


'use client'

import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from "lucide-react";
import ProductGrid from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import CategoryCarousel from '@/components/products/category-carousel';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

function AdminProductsPage() {
  const { user, isAuthenticating } = useAuth();
  const { cartCount, totalPrice } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    }
  }, [user, isAuthenticating, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        // Filter for visible products for this page
        const visibleProducts = fetchedProducts.filter(p => p.isVisible ?? true);
        setProducts(visibleProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(prev => prev === category ? '' : category);
  };
  
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.trim() !== '');
        if (searchTerms.length > 0) {
            filtered = filtered.filter(p => {
                const productText = `
                    ${p.id.toLowerCase()} 
                    ${p.name.toLowerCase()} 
                    ${p.category.toLowerCase()} 
                    ${p.description.toLowerCase()}
                `;
                return searchTerms.every(term => productText.includes(term));
            });
        }
    }
    
    return filtered;

  }, [products, selectedCategory, searchQuery]);


  if (isAuthenticating || !user || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8 mb-24">
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Catálogo de Productos</h1>
            <p className="text-muted-foreground">Selecciona los productos para el pedido del cliente.</p>
          </div>
        </div>
        
        <div className="sticky top-16 z-30 -mx-4 bg-background/95 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-6">
                 <div className="relative w-full lg:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por ID, nombre, categoría..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {categories.length > 0 && (
                    <div className="w-full lg:w-2/3">
                        <CategoryCarousel
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategorySelect={handleCategorySelect}
                        />
                    </div>
                )}
            </div>
        </div>
        
        <div className="pt-8">
            {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
            ) : (
            <div className='text-center py-10'>
                <p className='text-lg font-semibold'>No se encontraron productos</p>
                <p className='text-muted-foreground mt-2'>Intenta ajustar tu búsqueda o filtros.</p>
            </div>
            )}
        </div>


        {cartCount > 0 && (
             <div className="fixed bottom-4 right-24 md:right-4 z-50">
                <Link href="/checkout" passHref>
                    <Button
                        size="lg"
                        className="h-14 rounded-full shadow-xl pl-5 pr-6"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6" />
                            <Separator orientation="vertical" className="h-6 bg-primary-foreground/20" />
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-normal -mb-1">{cartCount} {cartCount > 1 ? 'productos' : 'producto'}</span>
                                <span className="font-bold text-lg">${new Intl.NumberFormat('es-AR').format(totalPrice)}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </div>
                    </Button>
                </Link>
            </div>
        )}
      </div>
  )
}

export default AdminProductsPage;

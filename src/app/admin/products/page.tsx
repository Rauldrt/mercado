
'use client'

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import ProductGrid from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

function AdminProductsPage() {
  const { user, isAuthenticating } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Catálogo de Productos</h1>
            <p className="text-muted-foreground">Selecciona los productos para el pedido del cliente.</p>
          </div>
          <Button asChild>
            <Link href="/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver Pedido ({cartCount})
            </Link>
          </Button>
        </div>
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
  )
}

export default AdminProductsPage;

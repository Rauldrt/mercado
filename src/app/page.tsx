"use client";

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const categories = useMemo(() => {
    const allCategories = allProducts.map(p => p.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  const filtersComponent = (
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(value) => {
            setSelectedCategory(value);
            if (isMobile) setSheetOpen(false);
        }}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        
        {isMobile ? (
             <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full mb-6">
                        <Filter className="mr-2 h-4 w-4" />
                        Mostrar Filtros
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle className="font-headline">Filtros</SheetTitle>
                        <SheetDescription>
                            Ajusta tus preferencias para encontrar el producto perfecto.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                       {filtersComponent}
                    </div>
                </SheetContent>
            </Sheet>
        ) : (
            <aside className="lg:col-span-1">
                {filtersComponent}
            </aside>
        )}

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Nuestros Productos</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} resultados</p>
          </div>
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-semibold">No se encontraron productos</h2>
              <p className="text-muted-foreground mt-2">Intenta ajustar tu búsqueda o filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

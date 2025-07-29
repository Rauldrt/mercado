"use client";

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import CategoryCarousel from '@/components/products/category-carousel';
import PromotionsCard from '@/components/products/promotions-card';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const categories = useMemo(() => {
    const allCategories = allProducts.map(p => p.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  const carouselCategories = useMemo(() => {
    return categories.filter(c => c !== 'all');
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [searchQuery, selectedCategory, priceRange]);
  
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('all'); // Toggle off if the same category is clicked
    } else {
      setSelectedCategory(category);
    }
  };

  const handleFilterCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if(isSheetOpen) {
      setSheetOpen(false);
    }
  }

  const filtersComponent = (
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleFilterCategoryChange}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Ndera-Store</h1>
        <p className="text-muted-foreground mt-2">Explora los productos y servicios de tu comunidad</p>
      </div>

      <div className="mb-12">
        <PromotionsCard />
      </div>

      <div className="mb-12">
        <CategoryCarousel 
          categories={carouselCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          {selectedCategory === 'all' ? 'Todos los Productos' : selectedCategory}
        </h2>
        <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">{filteredProducts.length} resultados</p>
             <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
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
        </div>
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
  );
}

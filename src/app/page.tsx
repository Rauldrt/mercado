"use client";

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </aside>
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Nuestros Productos</h1>
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

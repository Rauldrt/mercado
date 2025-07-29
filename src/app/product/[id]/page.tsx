
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/firebase';
import ProductView from '@/components/products/product-view';
import ProductRecommendations from '@/components/products/product-recommendations';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { personalizedProductRecommendations } from '@/ai/flows/product-recommendations';
import type { Product } from '@/lib/types';


interface ProductPageProps {
  params: {
    id: string;
  };
}

function RecommendationsFallback() {
  return (
    <div className="mt-12 lg:mt-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">También te podría interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
           <Skeleton key={i} className="h-[450px] w-full" />
        ))}
      </div>
    </div>
  )
}

async function getRecommendations(currentProduct: Product) {
  // Simulate user history for demonstration
  const userHistory = `El usuario está viendo el producto "${currentProduct.name}". Recientemente ha visto "Zapatillas Urbanas" y tiene un "Mate Imperial" en su carrito.`;

  let recommendedProducts: Product[] = [];
  const allProducts = await getProducts();

  try {
    const recommendationsResult = await personalizedProductRecommendations({ userHistory });
    
    const recommendedProductNames = recommendationsResult.recommendations;
    
    recommendedProducts = recommendedProductNames
        .map(name => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
        .filter((p): p is Product => p !== undefined && p.id !== currentProduct.id)
        .slice(0, 3);

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    // Fallback to showing products from the same category
    recommendedProducts = allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 3);
  }
  
  // If still no products (e.g., category had only one item), show some random ones
  if (recommendedProducts.length === 0) {
     recommendedProducts = [...allProducts]
        .sort(() => 0.5 - Math.random())
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 3);
  }
  return recommendedProducts;
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const recommendedProducts = await getRecommendations(product);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductView product={product}>
        <div className="mt-12 lg:mt-16">
          <Suspense fallback={<RecommendationsFallback />}>
            <ProductRecommendations products={recommendedProducts} />
          </Suspense>
        </div>
      </ProductView>
    </div>
  );
}

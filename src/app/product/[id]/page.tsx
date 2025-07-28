import { notFound } from 'next/navigation';
import { getProductById, products } from '@/lib/products';
import ProductView from '@/components/products/product-view';
import ProductRecommendations from '@/components/products/product-recommendations';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductGrid from '@/components/products/product-grid';

interface ProductPageProps {
  params: {
    id: string;
  };
}

function RecommendationsFallback() {
  const fallbackProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">También te podría interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fallbackProducts.map(p => (
           <Skeleton key={p.id} className="h-[450px] w-full" />
        ))}
      </div>
    </>
  )
}


export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductView product={product}>
        <div className="mt-12 lg:mt-16">
          <Suspense fallback={<RecommendationsFallback />}>
            <ProductRecommendations currentProduct={product} />
          </Suspense>
        </div>
      </ProductView>
    </div>
  );
}

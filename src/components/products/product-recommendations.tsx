import type { Product } from '@/lib/types';
import ProductGrid from './product-grid';

interface ProductRecommendationsProps {
  products: Product[];
}

export default function ProductRecommendations({ products }: ProductRecommendationsProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">También te podría interesar</h2>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>No hay recomendaciones disponibles en este momento.</p>
      )}
    </section>
  );
}

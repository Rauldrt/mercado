import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import ProductView from '@/components/products/product-view';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductView product={product} />
    </div>
  );
}

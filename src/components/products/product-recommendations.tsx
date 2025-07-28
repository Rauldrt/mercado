import { products, getProductById } from '@/lib/products';
import { personalizedProductRecommendations } from '@/ai/flows/product-recommendations';
import type { Product } from '@/lib/types';
import ProductGrid from './product-grid';

interface ProductRecommendationsProps {
  currentProduct: Product;
}

export default async function ProductRecommendations({ currentProduct }: ProductRecommendationsProps) {
  
  // Simulate user history for demonstration
  const userHistory = `El usuario está viendo el producto "${currentProduct.name}". Recientemente ha visto "Zapatillas Urbanas" y tiene un "Mate Imperial" en su carrito.`;

  let recommendedProducts: Product[] = [];

  try {
    const recommendationsResult = await personalizedProductRecommendations({ userHistory });
    
    const recommendedProductNames = recommendationsResult.recommendations;
    
    recommendedProducts = recommendedProductNames
        .map(name => products.find(p => p.name.toLowerCase() === name.toLowerCase()))
        .filter((p): p is Product => p !== undefined && p.id !== currentProduct.id)
        .slice(0, 3);

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    // Fallback to showing products from the same category
    recommendedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 3);
  }
  
  // If still no products (e.g., category had only one item), show some random ones
  if (recommendedProducts.length === 0) {
     recommendedProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 3);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">También te podría interesar</h2>
      <ProductGrid products={recommendedProducts} />
    </section>
  );
}

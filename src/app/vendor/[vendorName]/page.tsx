
import { products } from '@/lib/products';
import ProductGrid from '@/components/products/product-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

interface VendorPageProps {
  params: {
    vendorName: string;
  };
}

export default function VendorPage({ params }: VendorPageProps) {
  // Decode the vendor name from the URL (e.g., "Urbano%20Zapas" -> "Urbano Zapas")
  const vendorName = decodeURIComponent(params.vendorName);
  
  // Find all products by this vendor
  const vendorProducts = products.filter(p => p.vendor === vendorName);
  
  // Check if the vendor exists by seeing if there's at least one product
  const vendorExists = products.some(p => p.vendor === vendorName);

  if (!vendorExists) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-4 font-headline">Vendedor no encontrado</h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                No pudimos encontrar al vendedor "{vendorName}". Puede que el enlace esté mal o que ya no forme parte de nuestra comunidad.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">Volver a la tienda principal</Link>
              </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
            <Building className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{vendorName}</h1>
        </div>
        <p className="text-muted-foreground mt-2">Explora todos los productos de nuestra tienda.</p>
      </div>

      {vendorProducts.length > 0 ? (
        <ProductGrid products={vendorProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Esta vidriera está vacía por ahora</h2>
          <p className="text-muted-foreground mt-2">
            Este vendedor todavía no ha publicado productos.
          </p>
           <Button asChild className="mt-6">
                <Link href="/">Ver otros productos</Link>
            </Button>
        </div>
      )}
    </div>
  );
}

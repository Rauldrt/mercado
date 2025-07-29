
import { getProductsByVendor } from '@/lib/firebase';
import ProductGrid from '@/components/products/product-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

interface VendorPageProps {
  params: {
    vendorName: string;
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  // Decode the vendor name from the URL (e.g., "Urbano%20Zapas" -> "Urbano Zapas")
  const vendorName = decodeURIComponent(params.vendorName);
  
  // Find all products by this vendor
  const vendorProducts = await getProductsByVendor(vendorName);
  
  // For this page, we assume the vendor exists if they have products.
  // A more robust solution would be to have a separate 'vendors' collection in Firestore.
  if (vendorProducts.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-4 font-headline">Vendedor no encontrado o sin productos</h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                No pudimos encontrar productos para "{vendorName}". Puede que el enlace esté mal o que el vendedor aún no haya publicado nada.
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

      <ProductGrid products={vendorProducts} />

    </div>
  );
}

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { ZoomIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductDetail from './product-detail';

interface ProductViewProps {
  product: Product;
  children: React.ReactNode;
}

export default function ProductView({ product, children }: ProductViewProps) {
  return (
    <div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <Dialog>
                    <Carousel className="w-full">
                    <CarouselContent>
                        {product.imageUrls.map((url, index) => (
                        <CarouselItem key={index}>
                            <DialogTrigger asChild>
                                <div className="aspect-square relative group bg-secondary rounded-lg overflow-hidden">
                                    <Image
                                    src={url}
                                    alt={`${product.name} - imagen ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    data-ai-hint="product gallery"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </DialogTrigger>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            width={1200}
                            height={1200}
                            className="object-contain w-full h-full"
                            data-ai-hint="product image zoom"
                        />
                    </DialogContent>
                    </Carousel>
                </Dialog>
            </div>
            
            <ProductDetail product={product} />

        </div>
        {children}
    </div>
  );
}

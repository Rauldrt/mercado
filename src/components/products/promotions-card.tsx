
"use client";

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import { getPromotions } from "@/lib/firebase"
import type { Promotion } from "@/lib/types"
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export default function PromotionsCard() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      const fetchedPromotions = await getPromotions();
      setPromotions(fetchedPromotions);
      setLoading(false);
    }
    fetchPromotions();
  }, []);

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (loading) {
    return <Skeleton className="w-full h-[250px] md:h-[400px]" />;
  }

  if (promotions.length === 0) {
    return null; // Don't render anything if there are no promotions
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full h-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full">
        {promotions.map((promo, index) => (
          <CarouselItem key={promo.id || index} className="h-full">
            <div className="p-1 h-full">
              <Card className="h-full overflow-hidden">
                <CardContent className="relative flex h-full items-center justify-center p-0">
                  <Image 
                    src={promo.imageUrl} 
                    alt={promo.title}
                    fill
                    className={cn(
                        "object-cover transition-transform ease-in-out",
                        current === index + 1 
                          ? "scale-110 duration-[6000ms]" 
                          : "scale-100 duration-500"
                    )}
                    data-ai-hint={promo.imageHint}
                    priority={index === 0} // Prioritize loading the first image
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-white text-center p-6 flex flex-col items-center">
                    <h3 className={cn(
                        "text-2xl md:text-3xl font-bold font-headline transition-all duration-700 ease-out",
                        current === index + 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}>
                        {promo.title}
                    </h3>
                    <p className={cn(
                        "mt-2 mb-4 max-w-md transition-all duration-700 ease-out delay-200",
                        current === index + 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}>
                        {promo.description}
                    </p>
                    <div className={cn(
                        "transition-all duration-700 ease-out delay-300",
                         current === index + 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        <Button asChild>
                          <Link href={`/product/${promo.productId}`}>Ver Oferta</Link>
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  )
}

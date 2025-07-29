
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import { getPromotions } from "@/lib/firebase"
import type { Promotion } from "@/lib/types"

export default async function PromotionsCard() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  
  const promotions = await getPromotions();

  if (promotions.length === 0) {
    return null; // Don't render anything if there are no promotions
  }

  return (
    <Carousel
      // The plugin is now passed correctly for server components
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
      className="w-full h-full"
      // onMouseEnter and onMouseLeave are client-side events and cannot be used here
      // Autoplay plugin handles stopOnInteraction by default.
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
                    className="object-cover"
                    data-ai-hint={promo.imageHint}
                    priority={index === 0} // Prioritize loading the first image
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-white text-center p-6 flex flex-col items-center">
                    <h3 className="text-2xl md:text-3xl font-bold font-headline">{promo.title}</h3>
                    <p className="mt-2 mb-4 max-w-md">{promo.description}</p>
                    <Button asChild>
                      <Link href={promo.link}>Ver Oferta</Link>
                    </Button>
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


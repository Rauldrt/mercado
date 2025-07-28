
"use client"

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

const promotions = [
  {
    title: "25% OFF en Calzado",
    description: "Renueva tu estilo con nuestra última colección. ¡Solo por tiempo limitado!",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "shoes sale",
    link: "#"
  },
  {
    title: "Envío Gratis a todo el país",
    description: "En todas las compras superiores a $150.000. ¡No te lo pierdas!",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "delivery truck",
    link: "#"
  },
    {
    title: "Tecnología y Hogar",
    description: "Descubre las mejores ofertas en electrónica para tu casa.",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "modern living room",
    link: "#"
  },
]

export default function PromotionsCard() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full">
        {promotions.map((promo, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="p-1 h-full">
              <Card className="h-full overflow-hidden">
                <CardContent className="relative flex h-full items-center justify-center p-0">
                  <Image 
                    src={promo.imageUrl} 
                    alt={promo.title}
                    fill
                    className="object-cover"
                    data-ai-hint={promo.imageHint}
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

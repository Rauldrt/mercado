
"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shirt, ShoppingBasket, Home, Dumbbell, MonitorSmartphone } from "lucide-react";

interface CategoryCarouselProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'Calzado': () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2Z" />
      <path d="M15 13V5a2 2 0 0 0-2-2H8.5a2.5 2.5 0 0 0 0 5H13" />
      <path d="m4.42 12.3 l1.42 1.42" />
      <path d="M22 17H4.5" />
    </svg>
  ),
  'Hogar': Home,
  'Electrónica': MonitorSmartphone,
  'Indumentaria': Shirt,
  'Deportes': Dumbbell,
  'Default': ShoppingBasket,
};

export default function CategoryCarousel({ categories, selectedCategory, onCategorySelect }: CategoryCarouselProps) {

  return (
    <Carousel
        opts={{
        align: "start",
        }}
        className="w-full"
    >
        <CarouselContent>
        {categories.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons.Default;
            return (
            <CarouselItem key={category} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                <Card 
                    className={cn(
                    "cursor-pointer transition-all duration-300 h-full",
                    selectedCategory === category 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:shadow-md hover:-translate-y-1"
                    )}
                    onClick={() => onCategorySelect(category)}
                >
                    <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-center">
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{category}</span>
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            )
        })}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
    </Carousel>
  );
}

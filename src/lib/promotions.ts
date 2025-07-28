import type { Promotion } from './types';

export const promotions: Promotion[] = [
  {
    id: 'promo_1',
    title: "25% OFF en Calzado",
    description: "Renueva tu estilo con nuestra última colección. ¡Solo por tiempo limitado!",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "shoes sale",
    link: "/#products"
  },
  {
    id: 'promo_2',
    title: "Envío Gratis a todo el país",
    description: "En todas las compras superiores a $150.000. ¡No te lo pierdas!",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "delivery truck",
    link: "/#products"
  },
    {
    id: 'promo_3',
    title: "Tecnología y Hogar",
    description: "Descubre las mejores ofertas en electrónica para tu casa.",
    imageUrl: "https://placehold.co/800x400.png",
    imageHint: "modern living room",
    link: "/#products"
  },
];

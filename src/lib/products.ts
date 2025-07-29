import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Zapatillas Urbanas "Cóndor"',
    description: 'Zapatillas de cuero sintético de alta durabilidad, perfectas para el día a día en la ciudad. Diseño moderno y confort garantizado.',
    price: 89999.99,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Calzado',
    specifications: { material: 'Cuero Sintético', suela: 'Goma Antideslizante', color: 'Negro' },
    stock: 50,
    vendor: 'Urbano Zapas',
  },
  {
    id: '2',
    name: 'Mate Imperial "Pampa"',
    description: 'Mate de calabaza seleccionada, forrado en cuero genuino con virola de acero inoxidable. Incluye bombilla de alpaca.',
    price: 45500.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Hogar',
    specifications: { material: 'Calabaza y Cuero', virola: 'Acero Inoxidable', origen: 'Uruguay' },
    stock: 30,
    vendor: 'El Rincón del Matero',
  },
  {
    id: '3',
    name: 'Auriculares Inalámbricos "Tango"',
    description: 'Sonido de alta fidelidad con cancelación de ruido activa. Hasta 20 horas de autonomía y conexión Bluetooth 5.2.',
    price: 150000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Electrónica',
    specifications: { conectividad: 'Bluetooth 5.2', autonomía: '20 horas', cancelación_ruido: 'Activa' },
    stock: 25,
    vendor: 'TecnoStore',
  },
  {
    id: '4',
    name: 'Campera de Jean "Patagonia"',
    description: 'Un clásico atemporal. Campera de jean rígido con proceso de pre-lavado para mayor suavidad. Cuatro bolsillos funcionales.',
    price: 125000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Indumentaria',
    specifications: { material: 'Denim 14oz', corte: 'Regular Fit', color: 'Azul Oscuro' },
    stock: 40,
    vendor: 'Ropa al Paso',
  },
  {
    id: '5',
    name: 'Mochila de Trekking "Aconcagua"',
    description: 'Mochila de 60 litros de capacidad, ideal para escapadas de fin de semana. Tela impermeable y espaldares acolchados.',
    price: 180000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Deportes',
    specifications: { capacidad: '60 Litros', material: 'Nylon Ripstop', impermeable: 'Sí' },
    stock: 15,
    vendor: 'Aventura Extrema',
  },
  {
    id: '6',
    name: 'Lámpara de Escritorio LED "Luz"',
    description: 'Diseño minimalista con brazo flexible y tres niveles de intensidad. Bajo consumo y luz cálida para no forzar la vista.',
    price: 65000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Hogar',
    specifications: { tipo_luz: 'LED Cálida', potencia: '8W', material: 'Aluminio' },
    stock: 60,
    vendor: 'El Rincón del Matero',
  },
    {
    id: '7',
    name: 'Botines de Fútbol "Maradona"',
    description: 'Botines de cuero vacuno para césped natural. Tapones cónicos para máxima tracción y giros rápidos. Inspirados en el más grande.',
    price: 110000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Deportes',
    specifications: { material: 'Cuero Vacuno', suela: 'FG (Firm Ground)', color: 'Blanco y Celeste' },
    stock: 22,
    vendor: 'Aventura Extrema',
  },
  {
    id: '8',
    name: 'Smart TV 4K 55" "Cinema"',
    description: 'Disfrutá de tus series y películas con la mejor calidad de imagen. Sistema operativo Android TV, HDR10+ y sonido Dolby Atmos.',
    price: 750000.00,
    imageUrls: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    category: 'Electrónica',
    specifications: { resolucion: '4K UHD (3840x2160)', tamano: '55 pulgadas', sistema: 'Android TV' },
    stock: 10,
    vendor: 'TecnoStore',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

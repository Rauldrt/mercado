
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // This should always be the price per single unit
  unitsPerBulk?: number; // How many units are in a bulk package
  imageUrls: string[];
  category: string;
  specifications: Record<string, string>;
  stock: number; // Stock should be in single units
  vendor: string;
  vendorId: string;
  promotionTag?: string;
};

export type CartItem = {
  product: Product;
  quantity: number; // Number of units or bulks
  presentation: 'unit' | 'bulk';
  unitPrice: number; // The price of one item (either a single unit or a whole bulk) at the time of adding to cart
};

export type Order = {
  orderId: string;
  date: string;
  total: number;
  items: CartItem[];
  status: 'pendiente' | 'completado' | 'cancelado';
  orderComment?: string;
};

export type Customer = {
  id: string;
  userId?: string; // Link to Firebase Auth user
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  phoneNumber?: string;
  gpsLocation?: string;
  purchaseHistory: Order[];
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  productId: string; // Link directly to a product
};

    

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  specifications: Record<string, string>;
  stock: number;
  vendor: string;
  vendorId: string; // Add vendorId to associate product with a user
  promotionTag?: string; // Optional tag for sales, e.g., "25% OFF"
};

export type CartItem = {
  product: Product;
  quantity: number;
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
  purchaseHistory: {
    orderId: string;
    date: string;
    total: number;
  }[];
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  productId: string; // Link directly to a product
};

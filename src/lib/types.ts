export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  specifications: Record<string, string>;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Customer = {
  id: string;
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

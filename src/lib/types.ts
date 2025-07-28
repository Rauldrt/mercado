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

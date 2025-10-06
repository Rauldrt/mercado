
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product, CartItem } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity: number, presentation: 'unit' | 'bulk') => void;
  removeFromCart: (productId: string, presentation: 'unit' | 'bulk') => void;
  updateQuantity: (productId: string, quantity: number, presentation: 'unit' | 'bulk') => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  getItemQuantity: (productId: string, presentation: 'unit' | 'bulk') => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
       console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity = 1, presentation: 'unit' | 'bulk') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id && item.presentation === presentation);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.presentation === presentation
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const units = presentation === 'bulk' ? (product.unitsPerBulk || 1) : 1;
      const itemPrice = product.price * units;
      
      return [...prevItems, { product, quantity, presentation, unitPrice: itemPrice }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, presentation: 'unit' | 'bulk') => {
    setCartItems(prevItems => prevItems.filter(item => !(item.product.id === productId && item.presentation === presentation)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, presentation: 'unit' | 'bulk') => {
    if (quantity <= 0) {
      removeFromCart(productId, presentation);
    } else {
      setCartItems(prevItems => {
        return prevItems.map(item =>
          item.product.id === productId && item.presentation === presentation ? { ...item, quantity } : item
        );
      });
    }
  }, [removeFromCart]);

  const getItemQuantity = useCallback((productId: string, presentation: 'unit' | 'bulk') => {
    const item = cartItems.find(item => item.product.id === productId && item.presentation === presentation);
    return item ? item.quantity : 0;
  }, [cartItems]);


  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    totalPrice,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

    
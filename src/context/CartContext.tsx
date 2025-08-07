"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useAddToCart } from '@/hooks/cart/useAddToCart';
import { useCart as useCartQuery } from '@/hooks/cart/useCart';

interface CartItem {
  productId: string;
  variantId?: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string | undefined, size: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartCount, setCartCount] = useState(0);
  const { mutate: addToCartMutation } = useAddToCart();
  const userEmail = Cookies.get('userEmail') || '';
  const { data: cartData } = useCartQuery(userEmail);
  
  // Update cart count when cart data changes
  useEffect(() => {
    if (cartData?.cart) {
      const count = cartData.cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    }
  }, [cartData]);
  
  const addToCart = (item: CartItem) => {
    if (userEmail) {
      addToCartMutation({
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        quantity: item.quantity
      });
    }
  };
  
  const removeFromCart = (productId: string, variantId: string | undefined, size: string) => {
    // Implementation would go here if needed
    console.log('Remove from cart:', productId, variantId, size);
  };
  
  return (
    <CartContext.Provider value={{ cartCount, setCartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

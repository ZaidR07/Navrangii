"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useAddToCart } from '@/hooks/cart/useAddToCart';
import { useCart as useCartQuery } from '@/hooks/cart/useCart';
import { toast } from 'react-toastify';

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
  isCartPopupOpen: boolean;
  setCartPopupOpen: (isOpen: boolean) => void;
  cartPopupMessage: string;
  setCartPopupMessage: (message: string) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

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
  const [isCartPopupOpen, setCartPopupOpen] = useState(false);
  const [cartPopupMessage, setCartPopupMessage] = useState('');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { mutate: addToCartMutation } = useAddToCart();
  const userEmail = Cookies.get('userEmail') || '';
  const { data: cartData } = useCartQuery(userEmail);
  
  // Update cart count when cart data changes
  useEffect(() => {
    if (cartData?.cart && Array.isArray(cartData.cart)) {
      const count = cartData.cart.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [cartData]);
  
  const addToCart = (item: CartItem) => {
    if (userEmail) {
      addToCartMutation({
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        quantity: item.quantity
      }, {
        onSuccess: () => {
          // Show popup
          setCartPopupMessage(`${item.quantity} item${item.quantity > 1 ? 's' : ''} added to cart`);
          setCartPopupOpen(true);
          toast.success('Item added to cart successfully!');
        },
        onError: (error) => {
          toast.error('Failed to add item to cart: ' + error.message);
        }
      });
    } else {
      // Handle non-logged in users
      setLoginModalOpen(true);
    }
  };
  
  const removeFromCart = (productId: string, variantId: string | undefined, size: string) => {
    // Implementation would go here if needed
    console.log('Remove from cart:', productId, variantId, size);
  };
  
  return (
    <CartContext.Provider value={{ 
      cartCount, 
      setCartCount, 
      addToCart, 
      removeFromCart,
      isCartPopupOpen,
      setCartPopupOpen,
      cartPopupMessage,
      setCartPopupMessage,
      isLoginModalOpen,
      setLoginModalOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

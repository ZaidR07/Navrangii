"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useAddToCart } from '@/hooks/cart/useAddToCart';
import { useClearCart } from '@/hooks/cart/useClearCart';
import { useCart as useCartQuery } from '@/hooks/cart/useCart';
import { useAuth } from '@/context/UserContext';
import { toast } from 'react-toastify';
import LoginModal from '@/components/LoginModal';

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
  clearCart: () => void;
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
  const [pendingCartItem, setPendingCartItem] = useState<CartItem | null>(null);
  const { mutate: addToCartMutation } = useAddToCart();
  const { mutate: clearCartMutation } = useClearCart();
  const { user } = useAuth();
  const userEmail = user?.email || Cookies.get('userEmail') || '';
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
      // Save pending item and show login modal
      setPendingCartItem(item);
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // After login, add the pending item to cart
    if (pendingCartItem) {
      const email = Cookies.get('userEmail') || '';
      if (email) {
        addToCartMutation({
          productId: pendingCartItem.productId,
          variantId: pendingCartItem.variantId,
          size: pendingCartItem.size,
          quantity: pendingCartItem.quantity
        }, {
          onSuccess: () => {
            setCartPopupMessage(`${pendingCartItem.quantity} item${pendingCartItem.quantity > 1 ? 's' : ''} added to cart`);
            setCartPopupOpen(true);
            toast.success('Item added to cart successfully!');
          },
          onError: (error) => {
            toast.error('Failed to add item to cart: ' + error.message);
          }
        });
      }
      setPendingCartItem(null);
    }
  };
  
  const removeFromCart = (productId: string, variantId: string | undefined, size: string) => {
    // Implementation would go here if needed
    console.log('Remove from cart:', productId, variantId, size);
  };

  const clearCart = () => {
    if (userEmail) {
      clearCartMutation({ email: userEmail });
    }
  };
  
  return (
    <CartContext.Provider value={{ 
      cartCount, 
      setCartCount, 
      addToCart, 
      removeFromCart,
      clearCart,
      isCartPopupOpen,
      setCartPopupOpen,
      cartPopupMessage,
      setCartPopupMessage,
      isLoginModalOpen,
      setLoginModalOpen
    }}>
      {children}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => { setLoginModalOpen(false); setPendingCartItem(null); }} 
        onLoginSuccess={handleLoginSuccess}
      />
    </CartContext.Provider>
  );
};

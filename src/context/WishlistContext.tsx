"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types/productType';
import { useAuth } from '@/context/UserContext';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  requiresLogin: () => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    if (user) {
      loadWishlistItems(user.email);
    } else {
      setWishlistItems([]);
    }
  }, [user]);
  
  const loadWishlistItems = (email: string) => {
    try {
      const items = JSON.parse(localStorage.getItem(`wishlist_${email}`) || '[]');
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    }
  };
  
  const saveWishlistItems = (email: string, items: WishlistItem[]) => {
    try {
      localStorage.setItem(`wishlist_${email}`, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };
  
  const requiresLogin = () => {
    return !user;
  };
  
  const addToWishlist = (product: Product) => {
    if (!user) {
      // In a real app, this would trigger the login flow
      throw new Error('Login required');
    }
    
    // Check if product is already in wishlist
    if (wishlistItems.some(item => item.product._id === product._id)) {
      return; // Already in wishlist
    }
    
    const newItem: WishlistItem = {
      id: `${product._id}-${Date.now()}`,
      product,
      addedAt: new Date().toISOString(),
    };
    
    const updatedItems = [...wishlistItems, newItem];
    setWishlistItems(updatedItems);
    saveWishlistItems(user.email, updatedItems);
  };
  
  const removeFromWishlist = (productId: string) => {
    if (!user) return;
    
    const updatedItems = wishlistItems.filter(item => item.product._id !== productId);
    setWishlistItems(updatedItems);
    saveWishlistItems(user.email, updatedItems);
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product._id === productId);
  };
  
  const wishlistCount = wishlistItems.length;
  
  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist, 
        wishlistCount,
        requiresLogin
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

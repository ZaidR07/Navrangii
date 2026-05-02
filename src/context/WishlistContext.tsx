"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types/productType';
import { useAuth } from '@/context/UserContext';
import Cookies from 'js-cookie';
import axios from '@/lib/axios';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

interface WishlistData {
  email: string;
  wishlist: Array<{
    productId: string;
    addedAt: string;
  }>;
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
    if (user?.email) {
      loadWishlistItemsFromServer(user.email);
    } else {
      // Try to get user email from cookies as fallback
      const userEmail = Cookies.get('userEmail');
      if (userEmail) {
        loadWishlistItemsFromServer(userEmail);
      } else {
        setWishlistItems([]);
      }
    }
  }, [user]);
  
  const loadWishlistItemsFromServer = async (email: string) => {
    try {
      const response = await axios.get(`wishlist/${email}`);
      // Transform the response data to match our WishlistItem structure
      setWishlistItems(response.data.wishlist.map((item: any) => ({
        id: item.productId,
        product: item.product,
        addedAt: item.addedAt
      })));
    } catch (error) {
      console.error('Error loading wishlist from server:', error);
      setWishlistItems([]);
    }
  };
  
  
  const requiresLogin = () => {
    return !user;
  };
  
  const addToWishlist = async (product: Product) => {
    if (!user && !Cookies.get('userEmail')) {
      // In a real app, this would trigger the login flow
      throw new Error('Login required');
    }
    
    // Check if product is already in wishlist
    if (wishlistItems.some(item => item.product?._id === product._id)) {
      return; // Already in wishlist
    }
    
    const email = user?.email || Cookies.get('userEmail') || '';
    
    try {
      await axios.post(`wishlist/add`, {
        email,
        productId: product._id
      });
      
      // Refresh wishlist items
      loadWishlistItemsFromServer(email);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };
  
  const removeFromWishlist = async (productId: string) => {
    const email = user?.email || Cookies.get('userEmail');
    if (!email) return;
    
    try {
      await axios.post(`wishlist/remove`, { email, productId });
      
      // Refresh wishlist items
      loadWishlistItemsFromServer(email);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product?._id === productId);
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

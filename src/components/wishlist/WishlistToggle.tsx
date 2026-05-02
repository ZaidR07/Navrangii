"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/UserContext';
import LoginModal from '@/components/LoginModal';
import { Product } from '@/lib/types/productType';
import { useAddToWishlist } from '@/hooks/wishlist/useAddToWishlist';
import { useRemoveFromWishlist } from '@/hooks/wishlist/useRemoveFromWishlist';
import { useWishlist } from '@/hooks/wishlist/useWishlist';
import Cookies from 'js-cookie';

interface WishlistToggleProps {
  product: Product;
  className?: string;
  iconClassName?: string;
}

export default function WishlistToggle({ product, className = '', iconClassName = 'h-5 w-5' }: WishlistToggleProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Get user email from auth context or cookie
  const userEmail = user?.email || Cookies.get('userEmail') || '';
  
  // Wishlist hooks
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist(userEmail);
  
  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistData?.wishlist) {
      const found = wishlistData.wishlist.some((item: any) => item.productId === product._id);
      setIsWishlisted(found);
    }
  }, [wishlistData, product._id]);
  
  const handleToggleWishlist = () => {
    // Check if user is logged in
    if (!userEmail) {
      setIsLoginModalOpen(true);
      return;
    }
    
    try {
      if (isWishlisted) {
        removeFromWishlist({ email: userEmail, productId: product._id || '' });
      } else {
        addToWishlist({ email: userEmail, productId: product._id || '' });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  
  const handleLoginSuccess = () => {
    // Try to add to wishlist again after login
    const email = Cookies.get('userEmail') || '';
    if (email) {
      addToWishlist({ email, productId: product._id || '' });
      setIsWishlisted(true);
    }
  };
  
  return (
    <>
      <button
        onClick={handleToggleWishlist}
        className={`${className} ${isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`${iconClassName} ${isWishlisted ? 'fill-current' : ''}`} />
      </button>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
}

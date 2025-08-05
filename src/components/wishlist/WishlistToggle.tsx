"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/UserContext';
import LoginModal from '@/components/LoginModal';
import { Product } from '@/lib/types/productType';
import { useAddToWishlist } from '@/hooks/wishlist/useAddToWishlist';
import { useRemoveFromWishlist } from '@/hooks/wishlist/useRemoveFromWishlist';
import Cookies from 'js-cookie';

interface WishlistToggleProps {
  product: Product;
  className?: string;
  iconClassName?: string;
}

export default function WishlistToggle({ product, className = '', iconClassName = 'h-5 w-5' }: WishlistToggleProps) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Get user email from cookie
  const userEmail = Cookies.get('userEmail');
  
  // Wishlist hooks
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  
  // For now, we'll just use local state
  // In a real implementation, we would fetch the user's wishlist and check if the product is in it
  useEffect(() => {
    // Placeholder - in a real implementation we would check if product is in wishlist
    // setIsWishlisted(checkIfInWishlist(product._id));
  }, [product._id]);
  
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
    const userEmail = Cookies.get('userEmail');
    if (userEmail) {
      try {
        addToWishlist({ email: userEmail, productId: product._id || '' });
        setIsWishlisted(true);
      } catch (error) {
        console.error('Error adding to wishlist after login:', error);
      }
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

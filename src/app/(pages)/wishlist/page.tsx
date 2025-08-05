"use client";

import { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/wishlist/useWishlist';
import { useRemoveFromWishlist } from '@/hooks/wishlist/useRemoveFromWishlist';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import WishlistLoginModal from '@/components/wishlist/WishlistLoginModal';
import WishlistItem from '@/components/wishlist/WishlistItem';
import Cookies from 'js-cookie';

export default function WishlistPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Check if user is logged in using the userEmail cookie
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);
  
  const { data: wishlistData, isLoading, isError, refetch } = useWishlist(userEmail || '');
  const removeMutation = useRemoveFromWishlist();
  
  const wishlistItems = wishlistData?.wishlist || [];
  
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };
  
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    // The cookie is already set by the login process, so we don't need to set it here
    setIsLoginModalOpen(false);
    refetch();
  };
  
  const removeFromWishlist = async (productId: string) => {
    if (!userEmail) return;
    
    try {
      await removeMutation.mutateAsync({ email: userEmail, productId });
      // Refetch the wishlist data after successful removal
      refetch();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <X className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading wishlist</h3>
            <p className="text-gray-500 mb-6">There was a problem loading your wishlist. Please try again later.</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="text-red-500" />
            My Wishlist
          </h1>
          <span className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items that you like by clicking the heart icon on product pages</p>
            <button 
              onClick={handleLoginRequired}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item: any) => (
              <WishlistItem 
                key={item.productId} 
                item={{ productId: item.productId, product: item.product }} 
                onRemove={removeFromWishlist} 
              />
            ))}
          </div>
        )}
      </div>
      
      <WishlistLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

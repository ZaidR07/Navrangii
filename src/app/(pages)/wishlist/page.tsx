"use client";

import { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/wishlist/useWishlist';
import { useRemoveFromWishlist } from '@/hooks/wishlist/useRemoveFromWishlist';
import { motion } from 'framer-motion';
import { X, Heart, ShoppingCart } from 'lucide-react';
import WishlistLoginModal from '@/components/wishlist/WishlistLoginModal';
import WishlistItem from '@/components/wishlist/WishlistItem';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/UserContext';
import NavigationHeader from '@/components/NavigationHeader';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [undoItems, setUndoItems] = useState<any[]>([]);
  const [undoTimers, setUndoTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    const emailFromAuthOrCookie = user?.email || Cookies.get('userEmail') || '';
    setUserEmail(emailFromAuthOrCookie);
  }, [user?.email]);
  
  const { data: wishlistData, isLoading, isError, refetch } = useWishlist(userEmail);
  const removeMutation = useRemoveFromWishlist();
  
  // Filter out items that are in undo state
  const wishlistItems = (wishlistData?.wishlist || []).filter(
    (item: any) => !undoItems.some(undoItem => undoItem.productId === item.productId)
  );
  
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };
  
  const handleLoginSuccess = (email: string) => {
    setIsLoginModalOpen(false);
    refetch();
  };
  
  const removeFromWishlist = async (productId: string) => {
    if (!userEmail) return;
    
    // Find the item being removed
    const itemToRemove = (wishlistData?.wishlist || []).find(
      (item: any) => item.productId === productId
    );
    
    if (itemToRemove) {
      // Add to undo items
      setUndoItems(prev => [...prev, itemToRemove]);
      
      // Set a timer to actually remove after 2 seconds
      const timer = setTimeout(async () => {
        try {
          await removeMutation.mutateAsync({ email: userEmail, productId });
          // Refetch the wishlist data after successful removal
          refetch();
          // Remove from undo items
          setUndoItems(prev => prev.filter(item => item.productId !== productId));
          // Clear the timer
          setUndoTimers(prev => {
            const newTimers = { ...prev };
            delete newTimers[productId];
            return newTimers;
          });
        } catch (error) {
          console.error('Error removing from wishlist:', error);
          // Remove from undo items even if there's an error
          setUndoItems(prev => prev.filter(item => item.productId !== productId));
        }
      }, 2000);
      
      // Store the timer so it can be cleared if undo is clicked
      setUndoTimers(prev => ({ ...prev, [productId]: timer }));
    }
  };
  
  const undoRemove = (productId: string) => {
    // Clear the timer for this item
    if (undoTimers[productId]) {
      clearTimeout(undoTimers[productId]);
      setUndoTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[productId];
        return newTimers;
      });
    }
    
    // Remove from undo items
    setUndoItems(prev => prev.filter(item => item.productId !== productId));
  };
  
  if (!userEmail || isLoading) {
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
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <NavigationHeader />
      <div className="py-8 mt-36 lg:mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end mb-8" />
          
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Save items that you like by clicking the heart icon on product pages</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item: any, index: number) => (
                <div key={`${item.productId}-${index}`} className="relative">
                  <WishlistItem 
                    item={item} 
                    onRemove={removeFromWishlist} 
                  />
                  {undoItems.some(undo => undo.productId === item.productId) && (
                    <div className="fixed bottom-4 right-4 bg-white text-purple-600 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center border border-gray-200">
                      <span className="text-sm mr-3">Removed from wishlist</span>
                      <button 
                        onClick={() => undoRemove(item.productId)}
                        className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

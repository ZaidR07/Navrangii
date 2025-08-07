"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/cart/useCart';
import { useRemoveFromCart } from '@/hooks/cart/useRemoveFromCart';
import { useUpdateCartQuantity } from '@/hooks/cart/useUpdateCartQuantity';
import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import CartLoginModal from '@/components/cart/CartLoginModal';
import CartItem from '@/components/cart/CartItem';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { CartItem as CartItemType } from '@/hooks/cart/useCart';

export default function CartPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [undoItems, setUndoItems] = useState<any[]>([]);
  const [undoTimers, setUndoTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const router = useRouter();
  
  // Check if user is logged in using the userEmail cookie
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);
  
  const { data: cartData, isLoading, isError, refetch } = useCart(userEmail || '');
  const removeMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  
  // Filter out items that are in undo state
  const cartItems = (cartData?.cart || []).filter(
    (item: CartItemType) => !undoItems.some(undoItem => 
      undoItem.productId === item.productId && 
      undoItem.variantId === item.variantId && 
      undoItem.size === item.size
    )
  );
  
  // Calculate totals using the new variant data structure
  const subtotal = cartItems.reduce((total, item) => {
    // Use the variant field directly, fallback to old method if not available
    const selectedVariant = item.variant || (item.variantId 
      ? item.product?.variants?.find((v: any) => v._id === item.variantId)
      : item.product?.variants?.[0]);
    const sizeData = selectedVariant?.sizes?.find((s: any) => s.size === item.size) || selectedVariant?.sizes?.[0];
    const price = sizeData?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };
  
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    // The cookie is already set by the login process, so we don't need to set it here
    setIsLoginModalOpen(false);
    refetch();
  };
  
  const removeFromCart = async (productId: string, variantId: string | undefined, size: string) => {
    if (!userEmail) return;
    
    // Find the item being removed
    const itemToRemove = (cartData?.cart || []).find(
      (item: any) => item.productId === productId && item.variantId === variantId && item.size === size
    );
    
    if (itemToRemove) {
      // Add to undo items
      setUndoItems(prev => [...prev, itemToRemove]);
      
      // Set a timer to actually remove after 2 seconds
      const timer = setTimeout(async () => {
        try {
          await removeMutation.mutateAsync({ 
            email: userEmail, 
            productId,
            variantId,
            size
          });
          // Refetch the cart data after successful removal
          refetch();
          // Remove from undo items
          setUndoItems(prev => prev.filter(item => 
            !(item.productId === productId && item.variantId === variantId && item.size === size)
          ));
          // Clear the timer
          setUndoTimers(prev => {
            const newTimers = { ...prev };
            const key = `${productId}-${variantId || 'default'}-${size}`;
            delete newTimers[key];
            return newTimers;
          });
        } catch (error) {
          console.error('Error removing from cart:', error);
          // Remove from undo items even if there's an error
          setUndoItems(prev => prev.filter(item => 
            !(item.productId === productId && item.variantId === variantId && item.size === size)
          ));
        }
      }, 2000);
      
      // Store the timer so it can be cleared if undo is clicked
      const key = `${productId}-${variantId || 'default'}-${size}`;
      setUndoTimers(prev => ({ ...prev, [key]: timer }));
    }
  };
  
  const undoRemove = (productId: string, variantId: string | undefined, size: string) => {
    const key = `${productId}-${variantId || 'default'}-${size}`;
    // Clear the timer for this item
    if (undoTimers[key]) {
      clearTimeout(undoTimers[key]);
      setUndoTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[key];
        return newTimers;
      });
    }
    
    // Remove from undo items
    setUndoItems(prev => prev.filter(item => 
      !(item.productId === productId && item.variantId === variantId && item.size === size)
    ));
  };
  
  const updateQuantity = async (productId: string, variantId: string | undefined, size: string, quantity: number) => {
    if (!userEmail) return;
    
    try {
      await updateQuantityMutation.mutateAsync({
        email: userEmail,
        productId,
        variantId,
        size,
        quantity
      });
      // Refetch the cart data after successful update
      refetch();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
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
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading cart</h3>
            <p className="text-gray-500 mb-6">There was a problem loading your cart. Please try again later.</p>
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
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <span className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add items to your cart by clicking the "Add to Cart" button on product pages</p>
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <CartItem 
                    key={`${item.productId}-${item.variantId || 'default'}-${item.size}`} 
                    item={item} 
                    onRemove={removeFromCart} 
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
                
                {/* Undo items - these are temporarily hidden but still in the DOM for undo functionality */}
                {undoItems.map((item: any) => {
                  const key = `${item.productId}-${item.variantId || 'default'}-${item.size}`;
                  return (
                    <div key={`undo-${key}`} className="relative">
                      <CartItem 
                        key={key} 
                        item={item} 
                        onRemove={() => {}} // No-op since it's being removed
                        onUpdateQuantity={() => {}} // No-op since it's being removed
                      />
                      <div className="fixed bottom-4 right-4 bg-white text-purple-600 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center border border-gray-200">
                        <span className="text-sm mr-3">Removed from cart</span>
                        <button 
                          onClick={() => undoRemove(item.productId, item.variantId, item.size)}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CartLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

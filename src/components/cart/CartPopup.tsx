"use client";

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPopup() {
  const context = useContext(CartContext);
  const router = useRouter();
  
  // If context is not available, don't render anything
  if (!context) return null;
  
  const { isCartPopupOpen, setCartPopupOpen, cartPopupMessage, cartCount } = context;
  
  useEffect(() => {
    if (isCartPopupOpen) {
      const timer = setTimeout(() => {
        setCartPopupOpen(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isCartPopupOpen, setCartPopupOpen]);
  
  const handleViewCart = () => {
    setCartPopupOpen(false);
    router.push('/cart');
  };
  
  const handleUndo = () => {
    // For now, just close the popup
    // In a more advanced implementation, this would undo the add to cart action
    setCartPopupOpen(false);
  };
  
  if (!isCartPopupOpen) return null;
  
  return (
    <AnimatePresence>
      {isCartPopupOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full p-2">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{cartPopupMessage}</p>
                <p className="mt-1 text-sm text-gray-500">{cartCount} items in your cart</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleUndo}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                  >
                    Undo
                  </button>
                  <button
                    onClick={handleViewCart}
                    className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                  >
                    View Cart
                  </button>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setCartPopupOpen(false)}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

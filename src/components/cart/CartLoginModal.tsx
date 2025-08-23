"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface CartLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const CartLoginModal = ({ isOpen, onClose, onLoginSuccess }: CartLoginModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const router = useRouter();

  // Create a wrapped onClose function that resets justLoggedIn state
  const handleClose = () => {
    setJustLoggedIn(false);
    onClose();
  };

  // Auto-close modal after 3 seconds when user just logged in
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && justLoggedIn) {
      timer = setTimeout(() => {
        handleClose();
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, justLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set cookie
      Cookies.set('userEmail', email, { expires: 7 });
      
      // Set just logged in state
      setJustLoggedIn(true);
      
      // Notify parent component
      onLoginSuccess(email);
      
      // Reset form
      setEmail('');
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCart = () => {
    // Close modal and navigate to cart page
    handleClose();
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to View Cart</h2>
              <p className="text-gray-600">Please enter your email to access your cart</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              {justLoggedIn && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleViewCart}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Cart →
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartLoginModal;

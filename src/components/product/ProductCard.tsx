"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import WishlistToggle from '@/components/wishlist/WishlistToggle';

interface ProductCardProps {
  product: any; // Using any to match the wishlist data structure
  index?: number;
  showWishlist?: boolean;
  onRemoveFromWishlist?: (productId: string) => void;
  linkHref?: string;
}

export default function ProductCard({ 
  product, 
  index = 0,
  showWishlist = true,
  onRemoveFromWishlist,
  linkHref
}: ProductCardProps) {
  // Get the first variant's price or fallback to 0
  const firstVariant = product?.variants?.[0];
  const firstSize = firstVariant?.sizes?.[0];
  const price = firstSize?.sellingPrice || product?.price || 0;
  const originalPrice = firstSize?.marketPrice || product?.originalPrice || price;
  
  // Calculate discount percentage
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  // For rating, we'll use a default value since it's not in our product data
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 100) + 50;
  
  // State for undo functionality
  const [showUndo, setShowUndo] = useState(false);
  const [removedProductId, setRemovedProductId] = useState<string | null>(null);
  
  // Handle removal with undo functionality
  const handleRemoveWithUndo = (productId: string) => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(productId);
      setRemovedProductId(productId);
      setShowUndo(true);
      
      // Auto-hide undo after 2 seconds
      setTimeout(() => {
        setShowUndo(false);
        setRemovedProductId(null);
      }, 2000);
    }
  };
  
  // Handle undo action
  const handleUndo = () => {
    if (removedProductId) {
      // Here you would typically call an add to wishlist function
      // For now, we'll just hide the undo
      setShowUndo(false);
      setRemovedProductId(null);
    }
  };
  
  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative h-96 overflow-hidden">
        <img
          src={product?.image || firstVariant?.thumbnail || 'https://placehold.co/600x600/eee/aaa?text=No+Image'}
          alt={product?.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ aspectRatio: '3/4', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
        />
        
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discount}% OFF
          </div>
        )}
        
        {onRemoveFromWishlist && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveWithUndo(product?._id || '');
            }}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md transition-opacity duration-300 hover:bg-red-50"
            aria-label="Remove from wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Undo popup */}
        {showUndo && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10 flex items-center">
            <span className="text-sm mr-2">Removed from wishlist</span>
            <button 
              onClick={handleUndo}
              className="text-sm font-semibold text-purple-400 hover:text-purple-300"
            >
              Undo
            </button>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{product?.name || 'Product'}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={`star-${i}`} 
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({reviews})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-purple-600 mr-2">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center group-hover:shadow-lg mt-auto">
          <span className="mr-2">View Product</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
  
  // If linkHref is provided, wrap in Link, otherwise just return the card
  if (linkHref) {
    return (
      <Link href={linkHref}>
        <CardContent />
      </Link>
    );
  }
  
  return <CardContent />;
}

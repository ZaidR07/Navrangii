"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
      className="group cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
        <Image
          src={product?.image || firstVariant?.thumbnail || 'https://placehold.co/600x600/eee/aaa?text=No+Image'}
          alt={product?.name || 'Product'}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ aspectRatio: '4/5', objectFit: 'cover' }}
        />
        
        {discount > 0 && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
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
      
      <div className="p-4 flex-grow flex flex-col text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{product?.name || 'Product'}</h3>
        <p className="text-base text-purple-600">
          ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {originalPrice > price && (
            <span className="ml-2 text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )}
        </p>
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

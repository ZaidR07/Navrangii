"use client";

import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Product } from '@/lib/types/productType';

interface WishlistItemProps {
  item: {
    productId: string;
    product: Product;
  };
  onRemove: (productId: string) => void;
}

export default function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const { product } = item;
  
  // Get the first variant's price or fallback to 0
  const firstVariant = product.variants?.[0];
  const firstSize = firstVariant?.sizes?.[0];
  const price = firstSize?.sellingPrice || 0;
  const originalPrice = firstSize?.marketPrice || price;
  
  // Calculate discount percentage
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={product.image || firstVariant?.thumbnail || 'https://placehold.co/600x600/eee/aaa?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
        />
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        <button 
          onClick={() => onRemove(product._id || '')}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
          aria-label="Remove from wishlist"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(0)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

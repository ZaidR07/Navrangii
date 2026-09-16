"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/lib/types/productType';

interface CartItemProps {
  item: {
    productId: string;
    product: Product;
    variant: any; // New variant field with full variant data
    variantId?: string;
    size: string;
    quantity: number;
  };
  onRemove: (productId: string, variantId: string | undefined, size: string) => void;
  onUpdateQuantity: (productId: string, variantId: string | undefined, size: string, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const { product, variant, size, quantity } = item;
  const [itemQuantity, setItemQuantity] = useState(quantity);
  
  if (!product) return null;

  // Use the new variant field directly, fallback to old method if not available
  const selectedVariant = variant || (item.variantId 
    ? product?.variants?.find(v => v._id === item.variantId)
    : product?.variants?.[0]);
    
  // Get the selected size data
  const sizeData = selectedVariant?.sizes?.find((s: { size: string; sellingPrice: number; }) => s.size === size) || selectedVariant?.sizes?.[0];
  
  // Calculate prices
  const currentPrice = sizeData?.sellingPrice || 0;
  const originalPrice = sizeData?.marketPrice || 0;
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) { // Limit to 10 items
      setItemQuantity(newQuantity);
      onUpdateQuantity(item.productId, item.variantId, size, newQuantity);
    }
  };
  
  const handleRemove = () => {
    onRemove(item.productId, item.variantId, size);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-100 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-full h-full sm:w-24 sm:h-24 relative rounded-lg overflow-hidden bg-gray-100 mx-auto sm:mx-0 aspect-4/5">
        <Image
          src={selectedVariant?.thumbnail || selectedVariant?.gallery?.[0] || product?.image || '/placeholder.svg'}
          alt={product?.name || 'Product'}
          fill
          sizes="96px"
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{product?.name}</h3>
            {selectedVariant && (
              <p className="text-sm text-gray-600 mt-1">Color: {selectedVariant.color}</p>
            )}
            <p className="text-sm text-gray-600">Size: {size}</p>
          </div>
          <button 
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button 
              className="p-1 border text-gray-800 border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => handleQuantityChange(itemQuantity - 1)}
              disabled={itemQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 border text-gray-800 border-gray-300 rounded-lg min-w-[40px] text-center">
              {itemQuantity}
            </span>
            <button 
              className="p-1 border text-gray-800 border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => handleQuantityChange(itemQuantity + 1)}
              disabled={itemQuantity >= 10}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-purple-600">₹{(currentPrice * itemQuantity).toLocaleString()}</span>
              {originalPrice > currentPrice && (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{(originalPrice * itemQuantity).toLocaleString()}</span>
                  <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">{discount}% OFF</span>
                </>
              )}
            </div>
            {originalPrice > currentPrice && (
              <p className="text-xs text-green-600 mt-1">You save ₹{((originalPrice - currentPrice) * itemQuantity).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;

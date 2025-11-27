"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Truck, RotateCcw, Shield, ShoppingCart } from 'lucide-react';
import { Product, ProductVariantType } from '@/lib/types/productType';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

interface ProductDetailProps {
  product: Product;
  selectedVariant?: ProductVariantType;
  setSelectedVariant?: (variant: ProductVariantType) => void;
}

const ProductInfo = ({ product, selectedVariant, setSelectedVariant }: ProductDetailProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Use selected variant or first variant as fallback
  const currentVariant = selectedVariant || product.variants?.[0];

  // Get available sizes from current variant
  const availableSizes = currentVariant?.sizes || [];

  // Get available colors from all variants
  const availableColors = product.variants?.map(variant => variant.color) || [];

  // Get prices from selected size
  const selectedSizeData = availableSizes.find(size => size.size === selectedSize);
  const currentPrice = selectedSizeData?.sellingPrice || currentVariant?.sizes?.[0]?.sellingPrice || 0;
  const originalPrice = selectedSizeData?.marketPrice || currentVariant?.sizes?.[0]?.marketPrice || 0;
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // Set default size when variant changes
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].size);
    }
  }, [availableSizes, selectedSize]);

  // Handle color selection
  const handleColorSelect = (color: string) => {
    const variant = product.variants?.find(v => v.color === color);
    if (variant && setSelectedVariant) {
      setSelectedVariant(variant);
      // Reset selected size when variant changes
      setSelectedSize("");
    }
  };

  return (
    <div className="lg:col-span-1 lg:pl-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className='flex justify-between items-start'>
          <h1 className="text-3xl inline-block lg:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  text: `Check out this ${product.name} from Navrangi!`,
                  url: window.location.href
                });
              } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
              }
            }}
            className="p-2 flex items-center bg-white border border-purple-500 rounded-lg hover:bg-purple-50 transition-colors duration-200"
            title="Share product"
          >
            <p className='text-purple-600'>Share&nbsp;</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-purple-600"
            >
              <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path>
            </svg>
          </button>
        </div>


        <div className="flex items-center mb-4">
          <button
            onClick={() => {
              const reviewsSection = document.getElementById('reviews-section');
              if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </button>
          <button
            onClick={() => {
              const reviewsSection = document.getElementById('reviews-section');
              if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="ml-2 text-gray-600 hover:text-purple-600 transition-colors flex items-center"
          >
            (4.5) • 234 Reviews
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-purple-600">₹{currentPrice.toLocaleString()}</span>
            {originalPrice > currentPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="text-green-600 text-sm mt-1">Inclusive of all taxes</p>
          {selectedSize && selectedSizeData?.stock !== undefined && (
            <p className={`text-sm mt-2 ${selectedSizeData.stock < 5 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {selectedSizeData.stock < 5
                ? `Only ${selectedSizeData.stock} ${selectedSizeData.stock === 1 ? 'piece' : 'pieces'} left!`
                : `In Stock (${selectedSizeData.stock} available)`}
            </p>
          )}
        </div>
        {availableSizes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Size</h3>
            <div className="flex gap-2">
              {availableSizes.map((sizeOption: { size: string }) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption.size)}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${selectedSize === sizeOption.size ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {sizeOption.size}
                </button>
              ))}
            </div>
          </div>
        )}
        {availableColors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Color</h3>
            <div className="flex gap-2">
              {availableColors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${currentVariant?.color === color ? 'border-purple-600 scale-110' : 'border-gray-300 hover:border-gray-400'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quantity</h3>
          <div className="flex items-center gap-3">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-800" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}><Minus className="h-4 w-4" /></button>
            <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-gray-800 text-center">{quantity}</span>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-800" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <button
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            onClick={() => {
              if (!selectedSize) {
                toast.error('Please select a size');
                return;
              }
              if (!currentVariant) {
                toast.error('Please select a color variant');
                return;
              }
              if (!product._id) {
                toast.error('Product information is incomplete');
                return;
              }
              addToCart({
                productId: product._id,
                variantId: currentVariant._id || '',
                size: selectedSize,
                quantity: quantity
              });
            }}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">Buy Now</button>
        </div>
        <div className="flex flex-row flex-wrap lg:flex-nowrap mb-8">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg flex-1 min-w-[150px]"><Truck className="h-5 w-5 text-green-600" /><div><p className="font-medium text-sm">Free Shipping</p><p className="text-xs text-gray-600">On orders above ₹999</p></div></div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg flex-1 min-w-[150px]"><RotateCcw className="h-5 w-5 text-blue-600" /><div><p className="font-medium text-sm">Easy Returns</p><p className="text-xs text-gray-600">15 days return policy</p></div></div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg flex-1 min-w-[150px]"><Shield className="h-5 w-5 text-purple-600" /><div><p className="font-medium text-sm">Secure Payment</p><p className="text-xs text-gray-600">100% secure checkout</p></div></div>
        </div>
        <div className="mb-8 bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg text-gray-800 font-semibold mb-3">Product Details :-</h3>
          <div className="prose prose-sm text-gray-600">
            {/* <p>{product.description || "Premium quality product crafted with attention to detail and comfort."}</p> */}
            <table className="min-w-full mt-4 border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 font-medium text-gray-700 w-1/3">Material</td>
                  <td className="py-2 text-gray-600">{product.fabric || "Premium Cotton Blend"}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-700 w-1/3">Fit</td>
                  <td className="py-2 text-gray-600">Regular Fit</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-700 w-1/3">Care</td>
                  <td className="py-2 text-gray-600">Machine wash cold</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-700 w-1/3">Origin</td>
                  <td className="py-2 text-gray-600">Made in India</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInfo;

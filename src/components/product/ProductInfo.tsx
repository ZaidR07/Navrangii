import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, Heart } from 'lucide-react';
import { Product, ProductVariantType } from '@/lib/types/productType';
import WishlistToggle from '@/components/wishlist/WishlistToggle';

interface ProductDetailProps {
  product: Product;
  selectedVariant?: ProductVariantType;
  setSelectedVariant?: (variant: ProductVariantType) => void;
}

const ProductInfo = ({ product, selectedVariant, setSelectedVariant }: ProductDetailProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
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
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-gray-600">(4.5) • 234 Reviews</span>
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
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}><Minus className="h-4 w-4" /></button>
            <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">{quantity}</span>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"><ShoppingBag className="h-5 w-5" />Add to Cart</button>
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">Buy Now</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Truck className="h-5 w-5 text-green-600" /><div><p className="font-medium text-sm">Free Shipping</p><p className="text-xs text-gray-600">On orders above ₹999</p></div></div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><RotateCcw className="h-5 w-5 text-blue-600" /><div><p className="font-medium text-sm">Easy Returns</p><p className="text-xs text-gray-600">15 days return policy</p></div></div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Shield className="h-5 w-5 text-purple-600" /><div><p className="font-medium text-sm">Secure Payment</p><p className="text-xs text-gray-600">100% secure checkout</p></div></div>
        </div>
        <div className="flex justify-end mb-4">
          <WishlistToggle 
            product={product} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" 
            iconClassName="h-5 w-5" 
          />
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Product Details</h3>
          <div className="prose prose-sm text-gray-600">
            <p>{product.description || "Premium quality product crafted with attention to detail and comfort."}</p>
            <ul className="mt-4">
              <li>Material: {product.fabric || "Premium Cotton Blend"}</li>
              <li>Fit: Regular Fit</li>
              <li>Care: Machine wash cold</li>
              <li>Origin: Made in India</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInfo;

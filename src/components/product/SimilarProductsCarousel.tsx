import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types/productType';
import WishlistToggle from '@/components/wishlist/WishlistToggle';

interface SimilarProductsCarouselProps {
  products: Product[];
}

const SimilarProductsCarousel = ({ products }: SimilarProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productGroups = [];
  for (let i = 0; i < products.length; i += 4) {
    productGroups.push(products.slice(i, i + 4));
  }
  const productItems = productGroups.length > 0 ? productGroups : [[]];
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % productItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + productItems.length) % productItems.length);
  if (products.length === 0) return null;
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div className="flex gap-6" animate={{ x: -currentIndex * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          {productItems.map((group, groupIndex) => (
            <div key={groupIndex} className="flex-shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.map((product) => {
                const firstVariant = product.variants?.[0];
                const firstSize = firstVariant?.sizes?.[0];
                const currentPrice = firstSize?.sellingPrice || 0;
                const originalPrice = firstSize?.marketPrice || 0;
                const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
                return (
                  <motion.div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow" whileHover={{ y: -5 }}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={product.image || firstVariant?.gallery?.[0] || 'https://placehold.co/600x600/eee/aaa?text=No+Image'} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }} />
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">{discount}% OFF</div>
                      )}
                      <WishlistToggle 
                        product={product} 
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50" 
                        iconClassName="h-4 w-4" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">4.5</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">234 sold</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-600">₹{currentPrice.toLocaleString()}</span>
                        {originalPrice > currentPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2" onClick={e => { e.stopPropagation(); console.log('Add to cart'); }}>
                        View Product
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
      <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 hidden lg:flex" onClick={prevSlide} aria-label="Previous products">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 hidden lg:flex" onClick={nextSlide} aria-label="Next products">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="flex justify-center mt-6 space-x-2 lg:hidden">
        {productItems.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProductsCarousel;

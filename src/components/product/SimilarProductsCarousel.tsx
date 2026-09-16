import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types/productType';
// WishlistToggle removed per request
import Link from 'next/link';
import Image from 'next/image';

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
    <div>
      {/* Mobile: cards grid (no slider) */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => {
            const firstVariant = product.variants?.[0];
            const firstSize = firstVariant?.sizes?.[0];
            const currentPrice = firstSize?.sellingPrice || 0;
            const originalPrice = firstSize?.marketPrice || 0;
            const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
            return (
              <Link key={product._id} href={`/product/${product._id}`} className="w-full">
                <div className="h-full">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-white hover:shadow-lg transition-shadow">
                    <Image src={product.image || firstVariant?.gallery?.[0] || 'https://placehold.co/600x800/eee/aaa?text=No+Image'} alt={product.name} fill sizes="45vw" className="w-full h-full object-cover" />
                    {discount > 0 && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">{discount}% OFF</div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-purple-600">
                      ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {originalPrice > currentPrice && (
                        <span className="ml-1 text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop: keep existing slider with arrows */}
      <div className="relative hidden lg:block">
        <div className="overflow-hidden">
          <motion.div className="flex gap-6" animate={{ x: -currentIndex * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            {productItems.map((group, groupIndex) => (
              <div key={groupIndex} className="flex-shrink-0 w-full grid grid-cols-4 gap-6">
                {group.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const firstSize = firstVariant?.sizes?.[0];
                  const currentPrice = firstSize?.sellingPrice || 0;
                  const originalPrice = firstSize?.marketPrice || 0;
                  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
                  return (
                    <Link key={product._id} href={`/product/${product._id}`}>
                      <motion.div whileHover={{ y: -5 }}>
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-white hover:shadow-lg transition-shadow">
                          <Image src={product.image || firstVariant?.gallery?.[0] || 'https://placehold.co/600x800/eee/aaa?text=No+Image'} alt={product.name} fill sizes="25vw" className="w-full h-full object-cover" />
                          {discount > 0 && (
                            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">{discount}% OFF</div>
                          )}
                          {/* Removed wishlist icon */}
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-base text-purple-600">
                            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {originalPrice > currentPrice && (
                              <span className="ml-2 text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50" onClick={prevSlide} aria-label="Previous products">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50" onClick={nextSlide} aria-label="Next products">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SimilarProductsCarousel;

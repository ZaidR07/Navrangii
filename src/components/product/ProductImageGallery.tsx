import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductVariantType } from '@/lib/types/productType';
import WishlistToggle from '@/components/wishlist/WishlistToggle';

interface ProductDetailProps {
  product: Product;
  selectedVariant?: ProductVariantType;
}

const ProductImageGallery = ({ product, selectedVariant }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMobileImage, setCurrentMobileImage] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  // Get images from selected variant or first variant, or fallback to product image
  const variantImages = selectedVariant?.gallery || product.variants?.[0]?.gallery || [];
  const allImages = variantImages.length > 0 ? variantImages : [product.image || 'https://placehold.co/600x600/eee/aaa?text=No+Image'];
  
  // For desktop view - keep existing grouping
  const imageGroups = [];
  for (let i = 0; i < allImages.length; i += 4) {
    imageGroups.push(allImages.slice(i, i + 4));
  }
  const productItems = imageGroups.length > 0 ? imageGroups : [allImages];
  
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % productItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + productItems.length) % productItems.length);
  
  // Handle mobile image selection
  const handleMobileImageSelect = (index: number) => {
    setCurrentMobileImage(index);
    // Scroll to the selected image
    if (mobileScrollRef.current) {
      const scrollContainer = mobileScrollRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const scrollPosition = (index / allImages.length) * (scrollWidth - clientWidth);
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle mobile scroll to update current image
  const handleMobileScroll = () => {
    if (mobileScrollRef.current) {
      const scrollLeft = mobileScrollRef.current.scrollLeft;
      const scrollWidth = mobileScrollRef.current.scrollWidth;
      const clientWidth = mobileScrollRef.current.clientWidth;
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
      const imageIndex = Math.round(scrollPercentage * (allImages.length - 1));
      setCurrentMobileImage(imageIndex);
    }
  };
  
  return (
    <div className="lg:col-span-1">
      {/* Mobile View - Horizontal scroll with bubble indicators */}
      <div className="lg:hidden mb-6">
        {/* Horizontal scrollable images */}
        <div 
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar"
        >
          {allImages.map((image, index) => (
            <div 
              key={index}
              className="flex-shrink-0 snap-center"
              style={{ width: 'calc(100% - 1rem)' }}
            >
              <img 
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full aspect-[4/5] object-cover rounded-lg"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
              />
            </div>
          ))}
        </div>
        
        {/* Bubble indicators */}
        {allImages.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleMobileImageSelect(index)}
                className={`w-2 h-2 rounded-full ${index === currentMobileImage ? 'bg-purple-600' : 'bg-gray-300'}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop View - Keep existing functionality */}
      <div className="relative hidden lg:block">
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
          <img 
            src={allImages[selectedImage] || 'https://placehold.co/600x600/eee/aaa?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
          />
          <WishlistToggle 
            product={product} 
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50" 
            iconClassName="h-5 w-5" 
          />
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div className="flex gap-4" animate={{ x: -currentIndex * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              {productItems.map((group, groupIndex) => (
                <div key={groupIndex} className="flex-shrink-0 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {group.map((image: string, index: number) => {
                    const globalIndex = groupIndex * 4 + index;
                    return (
                      <motion.div
                        key={globalIndex}
                        className={`aspect-[4/5] rounded-lg overflow-hidden cursor-pointer ${selectedImage === globalIndex ? 'ring-2 ring-purple-600' : ''}`}
                        onClick={() => setSelectedImage(globalIndex)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img 
                          src={image}
                          alt={`${product.name} ${globalIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </div>
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50" onClick={prevSlide} aria-label="Previous images">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50" onClick={nextSlide} aria-label="Next images">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductImageGallery;

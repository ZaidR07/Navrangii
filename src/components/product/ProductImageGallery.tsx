import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Product, ProductVariantType } from '@/lib/types/productType';
import WishlistToggle from '@/components/wishlist/WishlistToggle';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductDetailProps {
  product: Product;
  selectedVariant?: ProductVariantType;
}

const ProductImageGallery = ({ product, selectedVariant }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMobileImage, setCurrentMobileImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
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
  
  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = (currentMobileImage + 1) % allImages.length;
        handleMobileImageSelect(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentMobileImage - 1 + allImages.length) % allImages.length;
        handleMobileImageSelect(prevIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentMobileImage, allImages.length]);

  // Close fullscreen when clicking outside the image
  useEffect(() => {
    if (!isFullscreen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (fullscreenRef.current && !fullscreenRef.current.contains(e.target as Node)) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFullscreen]);

  return (
    <div className="lg:col-span-1">
      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          >
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4">
                <span className="text-white text-sm">
                  {currentMobileImage + 1} / {allImages.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Main Image */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={allImages[currentMobileImage]}
                    alt={`${product.name} ${currentMobileImage + 1}`}
                    className="-mt-12 min-w-[90vw] lg:min-w-[22vw] max-h-[70vh]  max-w-[90vw] object-contain"
                    style={{ width: 'auto', height: 'auto' }}
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
                  />
                </div>
                
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const prevIndex = (currentMobileImage - 1 + allImages.length) % allImages.length;
                    handleMobileImageSelect(prevIndex);
                  }}
                  className="absolute left-4 bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const nextIndex = (currentMobileImage + 1) % allImages.length;
                    handleMobileImageSelect(nextIndex);
                  }}
                  className="absolute right-4 bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
              
              {/* Thumbnails */}
              <div className="flex overflow-x-auto py-4 gap-2 justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMobileImageSelect(idx)}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden',
                      idx === currentMobileImage ? 'border-purple-500' : 'border-transparent'
                    )}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100/eee/aaa?text=No+Image'; }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="flex-shrink-0 snap-center relative"
              style={{ width: 'calc(100% - 1rem)' }}
            >
              <button 
                onClick={() => {
                  setCurrentMobileImage(index);
                  setIsFullscreen(true);
                }}
                className="w-full h-full"
              >
                <img 
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full aspect-[4/5] object-cover rounded-lg"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
                />
              </button>
              {/* Wishlist Toggle Button */}
              <div className="absolute top-2 right-2">
                <WishlistToggle 
                  product={product} 
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                  iconClassName="h-5 w-5"
                />
              </div>
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

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '4/5' }}>
          <button 
            onClick={() => {
              setCurrentMobileImage(selectedImage);
              setIsFullscreen(true);
            }}
            className="w-full h-full"
          >
            <img
              src={allImages[selectedImage] || 'https://placehold.co/600x600/eee/aaa?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eee/aaa?text=No+Image'; }}
            />
          </button>
          <div className="absolute top-2 right-2">
            <WishlistToggle 
              product={product} 
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
              iconClassName="h-5 w-5"
            />
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-purple-600' : ''}`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100/eee/aaa?text=No+Image'; }}
                />
              </button>
            ))}
          </div>
        )}
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

"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { ProductDetailSkeleton } from '@/components/skeletons/site-skeletons';
import { Button } from '@/components/ui/button';
import { useGetProductById } from '@/hooks/product/useGetProduct';
import { useGetSimilarProducts } from '@/hooks/product/useGetProduct';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import SimilarProductsCarousel from '@/components/product/SimilarProductsCarousel';
import ReviewsSection from '@/components/product/ReviewsSection';
import MobileBottomNav from '@/components/MobileBottomNav';
import NavigationHeader from '@/components/NavigationHeader';
import Footer from '@/components/Footer';
import { Product, ProductVariantType } from '@/lib/types/productType';
import CartLoginModal from '@/components/cart/CartLoginModal';
import { useCart } from '@/context/CartContext';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | undefined>(undefined);
  
  // Cart context
  const { isLoginModalOpen, setLoginModalOpen } = useCart();
  
  // Parse product from URL if available (for server-side rendering)
  const productFromUrl = searchParams?.get('product') 
    ? (JSON.parse(searchParams.get('product') as string) as Product)
    : undefined;

  const { 
    data: product, 
    isLoading, 
    error
  } = useGetProductById(id || null, {
    initialData: productFromUrl,
    enabled: !productFromUrl && !!id,
  });
  
  // Set the first variant as default when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);
  
  // Fetch similar products based on current product's category and subcategory
  const { data: similarProducts = [] } = useGetSimilarProducts(
    product?.category, 
    product?.subcategory,
    product?._id,
    { enabled: !!product }
  );
  
  useEffect(() => {
    if (error) {
      console.error('Error loading product:', error);
      // You can add a toast notification here if needed
    }
  }, [error]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationHeader />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationHeader />
        <div className="mt-20 sm:mt-24 lg:mt-28 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error?.message || 'The product you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = (email: string) => {
    // Optionally show a success message
    // The modal will auto-close after 3 seconds due to justLoggedIn state
  };

  return (
    <>
      <NavigationHeader />
      <div className="min-h-screen bg-white pb-16 lg:pb-0">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mt-28 sm:mt-32 lg:mt-32">
          {/* Breadcrumb */}
          <nav className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-purple-600">Home</a>
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline text-gray-900">{product.name}</span>
            </div>
            
            
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <ProductImageGallery product={product} selectedVariant={selectedVariant} />
          <ProductInfo product={product} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
        </div>

        {/* Similar Products Section */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="border-t pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <SimilarProductsCarousel products={similarProducts} />
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
      
      {/* Cart Login Modal */}
      <CartLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
    </>
  );
};

export default ProductDetailPage;

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import WishlistToggle from '@/components/wishlist/WishlistToggle';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';
import { useGetProductReviewsAggregate } from "@/hooks/product/useGetProductReviewsAggregate";
import { SectionGridSkeleton } from '@/components/skeletons/site-skeletons';

interface ProductCardProps {
  product: ProductType;
  index: number;
  rating: number;
  reviewCount: number;
}

const ProductCard = ({ product, index, rating, reviewCount }: ProductCardProps) => {
  const variant = product.variants?.[0];
  const size = variant?.sizes?.[0];
  const sellingPrice = size?.sellingPrice || 0;
  const marketPrice = size?.marketPrice || 0;
  const discount = marketPrice > sellingPrice ? Math.round(((marketPrice - sellingPrice) / marketPrice) * 100) : 0;
  const image = variant?.thumbnail || variant?.gallery?.[0] || product.image || '/placeholder.png';

  return (
    <Link href={`/product/${product._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        className="group cursor-pointer transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            style={{ aspectRatio: '4/5', objectFit: 'cover' }}
          />
          {discount > 0 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}% OFF</span>
          )}
          <div className="absolute top-4 right-4">
            <WishlistToggle 
              product={product} 
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              iconClassName="h-5 w-5" 
            />
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-base text-purple-600">
            ₹{sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {marketPrice > sellingPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">₹{marketPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

const MobileProductCard = ({ product, index, rating, reviewCount }: ProductCardProps) => {
  const variant = product.variants?.[0];
  const size = variant?.sizes?.[0];
  const sellingPrice = size?.sellingPrice || 0;
  const marketPrice = size?.marketPrice || sellingPrice;
  const discount = marketPrice > sellingPrice ? Math.round(((marketPrice - sellingPrice) / marketPrice) * 100) : 0;
  const image = variant?.thumbnail || variant?.gallery?.[0] || product.image || '/placeholder.png';

  return (
    <Link href={`/product/${product._id}`}>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="w-full cursor-pointer"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-xl">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="w-full h-full object-cover"
            style={{ aspectRatio: '4/5', objectFit: 'cover' }}
          />
          {discount > 0 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}% OFF</span>
          )}
          <div className="absolute top-4 right-4">
            <WishlistToggle 
              product={product} 
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full" 
              iconClassName="h-5 w-5" 
            />
          </div>
        </div>
        <div className="p-3 text-center">
          <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-purple-600">
            ₹{sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {marketPrice > sellingPrice && (
              <span className="ml-1 text-xs text-gray-400 line-through">₹{marketPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default function BestSellingProducts() {
  const { data: products = [], isLoading } = useGetAllProducts();

  const bestSellerProducts = products.filter((p) => p.productType === "bestSeller");
  const displayProducts = (bestSellerProducts.length > 0 ? bestSellerProducts : products).slice(0, 8);

  const productIds = displayProducts.map((p) => p._id).filter(Boolean) as string[];
  const { data: reviewsData } = useGetProductReviewsAggregate(productIds);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionGridSkeleton />
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            BEST <span className="text-purple-600">SELLING</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
            Our most loved items by customers
          </p>
        </motion.div>
        
        {/* Mobile Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map((product, index) => (
              <div
                key={product._id || index}
                className={
                  displayProducts.length === 1
                    ? "col-span-2 flex justify-center"
                    : undefined
                }
              >
                <div className={displayProducts.length === 1 ? "w-full max-w-xs" : "w-full"}>
                  <MobileProductCard product={product} index={index} rating={reviewsData?.[product._id || ""]?.avgRating || 0} reviewCount={reviewsData?.[product._id || ""]?.reviewCount || 0} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <ProductCard key={product._id || index} product={product} index={index} rating={reviewsData?.[product._id || ""]?.avgRating || 0} reviewCount={reviewsData?.[product._id || ""]?.reviewCount || 0} />
            ))}
          </div>
          
          {/* View More Button */}
          {products.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/products?productType=bestSeller">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Best Sellers
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

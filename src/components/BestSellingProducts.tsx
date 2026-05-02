"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import WishlistToggle from '@/components/wishlist/WishlistToggle';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';

const ProductCard = ({ product, index }: { product: ProductType; index: number }) => {
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
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            style={{ aspectRatio: '3/4', objectFit: 'cover' }}
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>
          )}
          <div className="absolute top-4 right-4">
            <WishlistToggle 
              product={product} 
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              iconClassName="h-5 w-5" 
            />
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-purple-600 mr-2">₹{sellingPrice.toLocaleString()}</span>
              {marketPrice > sellingPrice && (
                <span className="text-sm text-gray-500 line-through">₹{marketPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const MobileProductCard = ({ product, index }: { product: ProductType; index: number }) => {
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
        className="w-full bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '3/4', objectFit: 'cover' }}
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>
          )}
          <div className="absolute top-4 right-4">
            <WishlistToggle 
              product={product} 
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full" 
              iconClassName="h-5 w-5" 
            />
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-purple-600 mr-1">₹{sellingPrice.toLocaleString()}</span>
              {marketPrice > sellingPrice && (
                <span className="text-xs text-gray-500 line-through">₹{marketPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function BestSellingProducts() {
  const { data: products = [], isLoading } = useGetAllProducts();

  const bestSellerProducts = products.filter((p) => p.productType === "bestSeller");
  const displayProducts = (bestSellerProducts.length > 0 ? bestSellerProducts : products).slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-purple-600">Loading best sellers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <MobileProductCard product={product} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <ProductCard key={product._id || index} product={product} index={index} />
            ))}
          </div>
          
          {/* View More Button */}
          {products.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg border-2 border-white hover:border-purple-200"
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

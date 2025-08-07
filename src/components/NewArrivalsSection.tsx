"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';
import Link from "next/link";

interface NewArrivalProduct {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
}

// Helper function to transform ProductType to NewArrivalProduct
const transformProduct = (product: ProductType): NewArrivalProduct => {
  // Get the first variant and first size for display
  const firstVariant = product.variants?.[0];
  const firstSize = firstVariant?.sizes?.[0];
  
  // Calculate discount percentage
  let discount = 0;
  if (firstSize?.marketPrice && firstSize?.sellingPrice && firstSize.marketPrice > firstSize.sellingPrice) {
    discount = Math.round(((firstSize.marketPrice - firstSize.sellingPrice) / firstSize.marketPrice) * 100);
  }
  
  return {
    id: product._id || '',
    name: product.name,
    price: firstSize?.sellingPrice ? `₹${firstSize.sellingPrice.toLocaleString()}` : "₹0",
    originalPrice: firstSize?.marketPrice ? `₹${firstSize.marketPrice.toLocaleString()}` : "₹0",
    discount: discount > 0 ? `${discount}% OFF` : "",
    image: firstVariant?.thumbnail || firstVariant?.gallery?.[0] || product.image || "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=500&fit=crop&crop=center",
    rating: 4.5, // Placeholder rating
    reviews: Math.floor(Math.random() * 100) + 50, // Placeholder reviews
  };
};

const ProductCard = ({ product, index }: { product: NewArrivalProduct; index: number }) => (
  <Link href={`/product/${product.id || `sample-${index}`}`}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ aspectRatio: '3/4', objectFit: 'cover' }}
        />
        {product.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-purple-600 mr-2">{product.price}</span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center group-hover:shadow-lg mt-auto">
          <span>View Product</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  </Link>
);

const MobileProductCard = ({ product, index }: { product: NewArrivalProduct; index: number }) => (
  <Link href={`/product/${product.id || `sample-${index}`}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-purple-600 mr-1">{product.price}</span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-center">
          <span>View Product</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  </Link>
);

export default function NewArrivalsSection() {
  const { data: products = [], isLoading, error } = useGetAllProducts();
  
  // Filter products for new arrivals
  // Looking for products with 'NEW' or 'ARRIVAL' in category or subcategory
  const newArrivalProducts = products
    .filter(product => {
      const category = product.category?.toUpperCase() || '';
      const subcategory = product.subcategory?.toUpperCase() || '';
      return category.includes('NEW') || category.includes('ARRIVAL') || 
             subcategory.includes('NEW') || subcategory.includes('ARRIVAL');
    })
    .map(transformProduct);
  
  // If no new arrival products found, take first 8 products as fallback
  const displayProducts = newArrivalProducts.length > 0 ? 
    newArrivalProducts.slice(0, 8) : 
    products.slice(0, 8).map(transformProduct);
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-indigo-600">Loading new arrivals...</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-red-600">Error loading new arrivals</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            NEW <span className="text-indigo-600">ARRIVALS</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover Our Latest Fashion Additions - Fresh Styles Just For You
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
            {displayProducts.map((product, index) => (
              <MobileProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* View More Button */}
          {products.length > 8 && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All New Arrivals
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

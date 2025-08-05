"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import { Product as ProductType } from "@/lib/types/productType";
import Link from "next/link";

interface Product {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
}

// Helper function to transform ProductType to SaleSection Product
const transformProduct = (product: ProductType): Product => {
  // Get the first variant and first size for display
  const firstVariant = product.variants?.[0];
  const firstSize = firstVariant?.sizes?.[0];

  // Calculate discount percentage
  let discount = 0;
  if (firstSize?.marketPrice && firstSize?.sellingPrice && firstSize.marketPrice > firstSize.sellingPrice) {
    discount = Math.round(((firstSize.marketPrice - firstSize.sellingPrice) / firstSize.marketPrice) * 100);
  }

  return {
    name: product.name,
    price: firstSize?.sellingPrice ? `₹${firstSize.sellingPrice.toLocaleString()}` : "₹0",
    originalPrice: firstSize?.marketPrice ? `₹${firstSize.marketPrice.toLocaleString()}` : "₹0",
    discount: discount > 0 ? `${discount}% OFF` : "",
    image: firstVariant?.thumbnail || firstVariant?.gallery?.[0] || product.image || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&crop=center",
    rating: 4.5 // Placeholder rating
  };
};

const getMonthlyTitle = () => {
  const month = new Date().getMonth();
  const rhymingTitles = [
    "Joyful January", "Fabulous February", "Marvelous March", "Amazing April",
    "Magnificent May", "Joyous June", "Jubilant July", "Awesome August",
    "Spectacular September", "Outstanding October", "Noteworthy November", "Dazzling December"
  ];
  return `${rhymingTitles[month]} Sale`;
};

const ProductCard = ({ product, index, productId, productData }: { product: Product; index: number; productId?: string; productData?: any }) => (
  <Link 
    href={{
      pathname: `/product/${productId || 'sample-product'}`,
      query: { product: productData ? JSON.stringify(productData) : undefined }
    }}
    as={`/product/${productId || 'sample-product'}`}
  >
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
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.discount}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-purple-600 mr-2">{product.price}</span>
            <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
          </div>
        </div>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center group-hover:shadow-lg mt-auto">
          <span>View Product</span>
          <ShoppingBag className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  </Link>
);

const MobileProductCard = ({ product, index, productId, productData }: { product: Product; index: number; productId?: string; productData?: any }) => (
  <Link 
    href={{
      pathname: `/product/${productId || 'sample-product'}`,
      query: { product: productData ? JSON.stringify(productData) : undefined }
    }}
    as={`/product/${productId || 'sample-product'}`}
  >
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ aspectRatio: '3/4', objectFit: 'cover' }}
        />
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.discount}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-purple-600 mr-1">{product.price}</span>
            <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
          </div>
        </div>
        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-md text-sm font-semibold transition-colors">
          View Product
        </button>
      </div>
    </motion.div>
  </Link>
);

interface SaleSectionProps {
  products?: ProductType[];
  loading?: boolean;
  error?: string | null;
}

export default function SaleSection({ products = [], loading = false, error = null }: SaleSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-100 to-violet-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 mb-4">
            {getMonthlyTitle()}
          </h2>
          <p className="text-xl md:text-2xl text-purple-700 mb-12">
            Up to 70% OFF on Selected Items
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-purple-600">Loading sale products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        )}

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
            {products.map((product, index) => (
              <MobileProductCard 
                key={index} 
                product={transformProduct(product)} 
                index={index} 
                productId={product._id}
                productData={product}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid with View More */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard 
                key={index} 
                product={transformProduct(product)} 
                index={index} 
                productId={product._id} 
                productData={product}
              />
            ))}
          </div>

          {/* View More Button */}
          {products.length > 8 && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg border-2 border-white hover:border-purple-200"
              >
                View More Sale Items
              </motion.button>
            </div>)}
        </div>
      </div>
    </section>
  );
}

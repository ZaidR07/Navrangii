"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';
import Link from "next/link";
import { useGetProductReviewsAggregate } from "@/hooks/product/useGetProductReviewsAggregate";

interface CoupleProduct {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
  category: "casual" | "formal" | "ethnic" | "western";
}

// Helper function to transform ProductType to CoupleProduct
const transformProduct = (product: ProductType): CoupleProduct => {
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
    image: firstVariant?.thumbnail || firstVariant?.gallery?.[0] || product.image || "/placeholder.svg",
    rating: 0,
    reviews: 0,
    category: "casual" as const,
  };
};

const ProductCard = ({ product, index }: { product: CoupleProduct; index: number }) => (
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
            <span className="text-sm text-gray-600 ml-2">{product.reviews > 0 ? `(${product.reviews})` : ""}</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-purple-600 mr-2">{product.price}</span>
            <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const MobileProductCard = ({ product, index }: { product: CoupleProduct; index: number }) => (
  <Link href={`/product/${product.id || `sample-${index}`}`}>
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
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
      <div className="p-3">
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-600 ml-1">{product.reviews > 0 ? `(${product.reviews})` : ""}</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-purple-600 mr-1">{product.price}</span>
            <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function HimHerSection() {
  const { data: products = [], isLoading, error } = useGetAllProducts();

  let hairProductsRaw = products.filter((product) => {
    const category = product.category?.toUpperCase() || "";
    const subcategory = product.subcategory?.toUpperCase() || "";
    return category.includes("HAIR") || subcategory.includes("HAIR");
  });

  if (hairProductsRaw.length === 0 && products.length > 0) {
    hairProductsRaw = products.slice(0, 8);
  }

  const productIds = hairProductsRaw.map((p) => p._id).filter(Boolean) as string[];
  const { data: reviewsData } = useGetProductReviewsAggregate(productIds);

  let hairProducts = hairProductsRaw.map(transformProduct).map((p) => {
    const real = reviewsData?.[p.id];
    return {
      ...p,
      rating: real?.avgRating || 0,
      reviews: real?.reviewCount || 0,
    };
  });

  
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-purple-600">Loading hair accessories...</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-red-600">Error loading hair accessories</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-purple-600">Hair</span> <span className="text-pink-500">Accessories</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Clips, Bands, Scrunchies & more - complete your look
          </p>
        </motion.div>

        {/* Mobile Grid */}
        <div className="lg:hidden mb-8">
          <div className="grid grid-cols-2 gap-4">
            {hairProducts.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className={
                  hairProducts.length === 1
                    ? "col-span-2 flex justify-center"
                    : undefined
                }
              >
                <div className={hairProducts.length === 1 ? "w-full max-w-xs" : "w-full"}>
                  <MobileProductCard product={product} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {hairProducts.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* View More Button */}
          {hairProducts.length > 8 && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Hair Accessories
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

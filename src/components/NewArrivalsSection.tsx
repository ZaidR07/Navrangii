"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';
import Link from "next/link";
import { useGetProductReviewsAggregate } from "@/hooks/product/useGetProductReviewsAggregate";

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
    image: firstVariant?.thumbnail || firstVariant?.gallery?.[0] || product.image || "/placeholder.svg",
    rating: 0,
    reviews: 0,
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
      <div className="relative h-64 overflow-hidden">
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
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">{product.reviews > 0 ? `(${product.reviews})` : ""}</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-purple-600 mr-2">{product.price}</span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
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
      className="w-full bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-600 ml-1">{product.reviews > 0 ? `(${product.reviews})` : ""}</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-purple-600 mr-1">{product.price}</span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function NewArrivalsSection() {
  const { data: products = [], isLoading, error } = useGetAllProducts();
  
  // Priority: explicit newArrival productType, then fallback to newest by createdAt
  const newArrivalProducts = [...products]
    .filter((p) => p.productType === "newArrival")
    .sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });

  const otherRecentProducts = [...products]
    .filter((p) => p.productType !== "newArrival")
    .sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });

  const latestProductsRaw = [...newArrivalProducts, ...otherRecentProducts].slice(0, 8);

  const productIds = latestProductsRaw.map((p) => p._id).filter(Boolean) as string[];
  const { data: reviewsData } = useGetProductReviewsAggregate(productIds);

  const latestProducts = latestProductsRaw.map(transformProduct).map((p) => {
    const real = reviewsData?.[p.id];
    return {
      ...p,
      rating: real?.avgRating || 0,
      reviews: real?.reviewCount || 0,
    };
  });

  const displayProducts = latestProducts;
  
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
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            NEW <span className="text-indigo-600">ARRIVALS</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto px-4">
            Discover Our Latest Fashion Additions - Fresh Styles Just For You
          </p>
        </motion.div>

        {/* Mobile Grid */}
        <div className="lg:hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
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
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* View More Button */}
          {products.length > 8 && (
            <div className="text-center">
              <Link href="/products?sort=new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All New Arrivals
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

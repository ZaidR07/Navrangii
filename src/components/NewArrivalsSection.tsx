"use client";

import { motion } from "framer-motion";
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product as ProductType } from '@/lib/types/productType';
import Link from "next/link";
import Image from "next/image";
import { useGetProductReviewsAggregate } from "@/hooks/product/useGetProductReviewsAggregate";
import { SectionGridSkeleton } from '@/components/skeletons/site-skeletons';

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
      className="group cursor-pointer transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ aspectRatio: '4/5', objectFit: 'cover' }}
        />
        {product.discount && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-base text-purple-600">
          {product.price}
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="ml-2 text-sm text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </p>
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
      className="w-full cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-3 text-center">
        <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-purple-600">
          {product.price}
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="ml-1 text-xs text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </p>
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
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionGridSkeleton />
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-red-600">Error loading new arrivals</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

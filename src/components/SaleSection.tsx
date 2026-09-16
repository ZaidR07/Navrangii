"use client";

import { motion } from "framer-motion";
import { Product as ProductType } from "@/lib/types/productType";
import Link from "next/link";
import Image from "next/image";
import { useGetProductReviewsAggregate } from "@/hooks/product/useGetProductReviewsAggregate";
import { ProductGridSkeleton } from '@/components/skeletons/site-skeletons';

interface Product {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviewCount: number;
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
    image: firstVariant?.thumbnail || firstVariant?.gallery?.[0] || product.image || "/placeholder.svg",
    rating: 0,
    reviewCount: 0,
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
        <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
          {product.discount}
        </div>
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
      className="w-full cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-4 border-gray-100 shadow-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover"
          style={{ aspectRatio: '4/5', objectFit: 'cover' }}
        />
        <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
          {product.discount}
        </div>
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

interface SaleSectionProps {
  products?: ProductType[];
  loading?: boolean;
  error?: string | null;
}

export default function SaleSection({ products = [], loading = false, error = null }: SaleSectionProps) {
  const productIds = products.map((p) => p._id).filter(Boolean) as string[];
  const { data: reviewsData } = useGetProductReviewsAggregate(productIds);

  const getProductRating = (productId?: string) => {
    if (!productId || !reviewsData?.[productId]) return { rating: 0, reviewCount: 0 };
    return {
      rating: reviewsData[productId].avgRating,
      reviewCount: reviewsData[productId].reviewCount,
    };
  };

  const transformProductWithReviews = (product: ProductType) => {
    const base = transformProduct(product);
    const real = getProductRating(product._id);
    return {
      ...base,
      rating: real.rating,
      reviewCount: real.reviewCount,
    };
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple-100 to-violet-200">
      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-purple-800 mb-4">
            {getMonthlyTitle()}
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-purple-700 mb-12">
            Up to 70% OFF on Selected Items
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && <ProductGridSkeleton count={8} />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        )}

        {/* Mobile Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={index}
                className={
                  products.length === 1
                    ? "col-span-2 flex justify-center"
                    : undefined
                }
              >
                <div className={products.length === 1 ? "w-full max-w-xs" : "w-full"}>
                  <MobileProductCard
                    product={transformProductWithReviews(product)}
                    index={index}
                    productId={product._id}
                    productData={product}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid with View More */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard 
                key={index} 
                product={transformProductWithReviews(product)} 
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

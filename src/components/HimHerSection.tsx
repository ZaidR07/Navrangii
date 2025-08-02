"use client";

import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";

interface CoupleProduct {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
  category: "casual" | "formal" | "ethnic" | "western";
}

const coupleProducts: CoupleProduct[] = [
  {
    id: 1,
    name: "Matching Casual T-Shirt Set",
    price: "₹1,999",
    originalPrice: "₹3,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=500&fit=crop&crop=center",
    rating: 4.6,
    reviews: 89,
    category: "casual"
  },
  {
    id: 2,
    name: "Elegant Formal Couple Set",
    price: "₹4,999",
    originalPrice: "₹8,999",
    discount: "44% OFF",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop&crop=center",
    rating: 4.8,
    reviews: 156,
    category: "formal"
  },
  {
    id: 3,
    name: "Traditional Ethnic Matching",
    price: "₹6,999",
    originalPrice: "₹12,999",
    discount: "46% OFF",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop&crop=center",
    rating: 4.9,
    reviews: 234,
    category: "ethnic"
  },
  {
    id: 4,
    name: "Western Couple Outfit",
    price: "₹3,499",
    originalPrice: "₹6,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center",
    rating: 4.7,
    reviews: 123,
    category: "western"
  },
  {
    id: 5,
    name: "Coordinated Denim Set",
    price: "₹2,999",
    originalPrice: "₹5,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=400&h=500&fit=crop&crop=center",
    rating: 4.5,
    reviews: 98,
    category: "casual"
  },
  {
    id: 6,
    name: "Party Wear Couple Set",
    price: "₹7,999",
    originalPrice: "₹14,999",
    discount: "47% OFF",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center",
    rating: 4.8,
    reviews: 187,
    category: "formal"
  }
];

const ProductCard = ({ product, index }: { product: CoupleProduct; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {product.discount}
      </div>
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-purple-600">{product.price}</span>
          <span className="text-lg text-gray-500 line-through ml-2">{product.originalPrice}</span>
        </div>
      </div>
      <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
        <span>Add to Cart</span>
        <ShoppingBag className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.div>
);

const MobileProductCard = ({ product, index }: { product: CoupleProduct; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-lg"
  >
    <div className="relative h-80 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
        {product.discount}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-purple-600">{product.price}</span>
          <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HimHerSection() {
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-purple-600">Him</span> & <span className="text-pink-500">Her</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Perfect Couple Twinning Collections - Coordinate Your Style Together
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
            {coupleProducts.map((product, index) => (
              <MobileProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {coupleProducts.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          {/* View More Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Couple Collections
            </motion.button>
          </div>
        </div>


      </div>
    </section>
  );
}

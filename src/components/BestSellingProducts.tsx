"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";

interface Product {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}

const bestSellingProducts: Product[] = [
  {
    name: "Designer Saree Collection",
    price: "₹5,999",
    originalPrice: "₹9,999",
    image: "https://images.unsplash.com/photo-1590334286379-7aaefd9c7dac?w=300&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 342
  },
  {
    name: "Gold Plated Necklace Set",
    price: "₹3,499",
    originalPrice: "₹5,999",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 278
  },
  {
    name: "Party Wear Lehenga",
    price: "₹8,999",
    originalPrice: "₹14,999",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 412
  },
  {
    name: "Bridal Jewelry Set",
    price: "₹12,999",
    originalPrice: "₹19,999",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 198
  },
  {
    name: "Casual Kurti Set",
    price: "₹1,499",
    originalPrice: "₹2,499",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 523
  },
  {
    name: "Designer Handbag",
    price: "₹2,999",
    originalPrice: "₹4,999",
    image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=300&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 387
  }
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative h-80 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ShoppingBag className="h-5 w-5 text-gray-600 hover:text-purple-600 transition-colors" />
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
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-purple-600">{product.price}</span>
          <span className="text-lg text-gray-500 line-through ml-2">{product.originalPrice}</span>
        </div>
        <button className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

const MobileProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-xl"
  >
    <div className="relative h-80 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
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

export default function BestSellingProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Best Selling Products
          </h2>
          <p className="text-xl text-gray-600">
            Our most loved items by customers
          </p>
        </motion.div>
        
        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
            {bestSellingProducts.map((product, index) => (
              <MobileProductCard key={index} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-3 gap-8">
            {bestSellingProducts.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

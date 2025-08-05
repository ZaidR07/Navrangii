"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import WishlistToggle from '@/components/wishlist/WishlistToggle';

interface Product {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}

const featuredProducts: Product[] = [
  {
    name: "Elegant Evening Gown",
    price: "₹4,999",
    originalPrice: "₹7,999",
    image: "https://images.unsplash.com/photo-1566479179817-c0b7b6d1a8a0?w=300&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 124
  },
  {
    name: "Diamond Necklace Set",
    price: "₹8,999",
    originalPrice: "₹12,999",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 89
  },
  {
    name: "Designer Lehenga",
    price: "₹15,999",
    originalPrice: "₹22,999",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 156
  },
  {
    name: "Bridal Jewelry Collection",
    price: "₹25,999",
    originalPrice: "₹35,999",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 203
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked selections from our premium collections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <Link key={product.name} href={`/product/featured-${index}`}>
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
                  style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />
                <div className="absolute top-4 right-4">
                  <WishlistToggle 
                    product={product as any} 
                    className="bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    iconClassName="h-5 w-5" 
                  />
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
                </div>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Category {
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  image: string;
  href: string;
}

const categories: Category[] = [
  {
    title: "Women's Collection",
    subtitle: "Elegant & Trendy",
    bgColor: "from-rose-400 to-pink-500",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop&crop=center",
    href: "/category/women"
  },
  {
    title: "Men's Collection",
    subtitle: "Bold & Stylish",
    bgColor: "from-blue-400 to-indigo-500",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    href: "/category/men"
  },
  {
    title: "Couple's Collection",
    subtitle: "Perfect Pairs",
    bgColor: "from-purple-400 to-violet-500",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=300&fit=crop&crop=center",
    href: "/category/couples"
  },
  {
    title: "Jewelry Collection",
    subtitle: "Sparkle & Shine",
    bgColor: "from-yellow-400 to-orange-500",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center",
    href: "/category/jewelry"
  }
];

export default function CategoriesSection() {
  return (
    <>
      {/* Desktop Version */}
      <section className="py-20 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-lg text-gray-600">Explore our curated collections for every occasion</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => window.location.href = category.href}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-80`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h4>
                    <p className="text-gray-600 mb-4">{category.subtitle}</p>
                    <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Version - 2 Column Grid */}
      <section className="py-12 bg-white lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h3>
            <p className="text-sm sm:text-base text-gray-600">Explore our curated collections</p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer"
                onClick={() => window.location.href = category.href}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-32 sm:h-40 relative overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-70`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{category.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{category.subtitle}</p>
                    <div className="flex items-center text-purple-600 font-semibold text-xs sm:text-sm">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-active:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

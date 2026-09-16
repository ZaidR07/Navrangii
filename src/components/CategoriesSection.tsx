"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
    image: "/woman_collection.jpg",
    href: "/products?section=WOMEN'S%20WEAR"
  },
  {
    title: "Men's Collection",
    subtitle: "Bold & Stylish",
    bgColor: "from-blue-400 to-indigo-500",
    textColor: "text-white",
    image: "/mens_collection.jpg",
    href: "/products?section=MEN'S%20WEAR"
  },
  {
    title: "Hair Accessories",
    subtitle: "Style Your Look",
    bgColor: "from-purple-400 to-violet-500",
    textColor: "text-white",
    image: "/couple_collection.jpg",
    href: "/products?section=Hair%20Accessories"
  },
  {
    title: "Jewelry Collection",
    subtitle: "Sparkle & Shine",
    bgColor: "from-yellow-400 to-orange-500",
    textColor: "text-white",
    image: "/jewellery_collection.jpg",
    href: "/products?section=JEWELRY"
  }
];

export default function CategoriesSection() {
  return (
    <>
      {/* Desktop Version */}
      <section className="py-20 bg-white hidden lg:block">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Image 
                      src={category.image} 
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
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
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6">
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
                    <Image 
                      src={category.image} 
                      alt={category.title}
                      fill
                      sizes="50vw"
                      className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                    />
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

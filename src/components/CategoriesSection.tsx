"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Category {
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
}

const categories: Category[] = [
  {
    title: "Women's Outfits",
    subtitle: "Elegant & Trendy",
    bgColor: "from-rose-400 to-pink-500",
    textColor: "text-white"
  },
  {
    title: "Jewelry Collection",
    subtitle: "Sparkle & Shine",
    bgColor: "from-purple-400 to-violet-500",
    textColor: "text-white"
  },
  {
    title: "Couple Suites",
    subtitle: "Perfect Pairs",
    bgColor: "from-indigo-400 to-purple-500",
    textColor: "text-white"
  },
  {
    title: "Family Twinning",
    subtitle: "Match Together",
    bgColor: "from-violet-400 to-purple-500",
    textColor: "text-white"
  }
];

export default function CategoriesSection() {
  return (
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
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`h-48 bg-gradient-to-br ${category.bgColor} flex items-center justify-center`}>
                  <Sparkles className="h-12 w-12 text-white" />
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
  );
}

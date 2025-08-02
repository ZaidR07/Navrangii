"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  href: string;
  image: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "women",
    name: "Women's Outfits",
    href: "/category/women",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&crop=center",
    bgColor: "bg-pink-100"
  },
  {
    id: "men",
    name: "Men's Outfits",
    href: "/category/men",
    image: "https://images.unsplash.com/photo-1539109136884-43d0e9d63eee?w=300&h=300&fit=crop&crop=center",
    bgColor: "bg-blue-100"
  },
  {
    id: "jewelry",
    name: "Jewelry",
    href: "/category/jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop&crop=center",
    bgColor: "bg-yellow-100"
  },
  {
    id: "couples",
    name: "Couple Suites",
    href: "/category/couples",
    image: "https://images.unsplash.com/photo-1519669417670-68775a509115?w=300&h=300&fit=crop&crop=center",
    bgColor: "bg-purple-100"
  }
];

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 h-[90vh] max-h-[800px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center text-gray-900">Categories</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Categories Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="group block"
                    onClick={onClose}
                  >
                    <div className="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className={`relative w-20 h-20 rounded-full ${category.bgColor} overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-200`}>
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors text-center">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

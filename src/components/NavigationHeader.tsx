"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoriesModal from "./CategoriesModal";

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (category: string) => pathname.includes(`/category/${category}`);

  const categories = [
    { name: "Women's Outfits", id: "women" },
    { name: "Men's Outfits", id: "men" },
    { name: "Jewelry", id: "jewelry" },
    { name: "Couple Suites", id: "couples" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">Darshu Fashion</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className={`px-1 pt-1 text-sm font-medium ${
                      isCategoryActive(category.id)
                        ? 'text-purple-600 border-b-2 border-purple-500'
                        : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
                
                <Link
                  href="/new-arrivals"
                  className={`px-1 pt-1 text-sm font-medium ${
                    isActive('/new-arrivals')
                      ? 'text-purple-600 border-b-2 border-purple-500'
                      : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                  }`}
                >
                  New Arrivals
                </Link>
                
                <Link
                  href="/sale"
                  className={`px-1 pt-1 text-sm font-medium ${
                    isActive('/sale')
                      ? 'text-purple-600 border-b-2 border-purple-500'
                      : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                  }`}
                >
                  Sale
                </Link>
              </nav>
            </div>

            {/* Mobile menu button - Removed */}
            <div className="lg:hidden w-6">
              {/* Empty div for spacing */}
            </div>

            {/* Right Side Icons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {/* Icons hidden on mobile/tablet, only show on desktop */}
              <Link href="/wishlist" className="hidden lg:block relative p-2 text-gray-600 hover:text-purple-500">
                <Heart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
                </span>
              </Link>
              <Link href="/cart" className="hidden lg:block relative p-2 text-gray-600 hover:text-purple-500">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isCategoryActive(category.id)
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              {[
                { name: "New Arrivals", href: "/new-arrivals" },
                { name: "Sale", href: "/sale" }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Categories Modal */}
      <CategoriesModal isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} />
    </>
  );
}

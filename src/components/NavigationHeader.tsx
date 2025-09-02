"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, X, Sparkles, ChevronDown, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoriesModal from "./CategoriesModal";
import { useAuth } from '@/context/UserContext';
import { useCartCount } from '@/hooks/cart/useCartCount';
import { useWishlistCount } from '@/hooks/wishlist/useWishlistCount';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface WishlistIconProps {
  userEmail: string | null;
}

function WishlistIcon({ userEmail }: WishlistIconProps) {
  const { data, isLoading } = useWishlistCount(userEmail || '');
  
  const wishlistCount = data?.count || 0;
  
  return (
    <Link href="/wishlist" className="p-2 text-gray-600 hover:text-purple-500 relative">
      <Heart className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {isLoading ? '0' : wishlistCount}
      </span>
    </Link>
  );
}

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { data: cartData, isLoading: isCartLoading } = useCartCount(userEmail || '');

  // Check if user is logged in by checking for email cookie - only on client side
  useEffect(() => {
    const email = Cookies.get('userEmail');
    setIsUserLoggedIn(!!email);
    setUserEmail(email || null);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (category: string) => pathname.includes(`/category/${category}`);

  const categories = [
    { name: "Women's Outfits", id: "WOMEN'S" },
    { name: "Men's Outfits", id: "MEN'S" },
    { name: "Jewelry", id: "JEWELRY" },
    { name: "Couple Suites", id: "COUPLE'S" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Darshu Fashion Logo"
                  width={720}
                  height={216}
                  priority
                  className="h-28 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
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
                
                
              </nav>
            </div>
            
            {/* Right Side Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                {/* Wishlist */}
                <WishlistIcon userEmail={userEmail} />
                
                {/* Cart */}
                <Link 
                  href="/cart" 
                  className="relative p-2 text-gray-600 hover:text-purple-500"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {isCartLoading ? '0' : cartData?.count || 0}
                  </span>
                </Link>
                
                {/* Profile/Login Button */}
                {isUserLoggedIn ? (
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="p-2 text-gray-600 hover:text-purple-500"
                    aria-label="Profile"
                  >
                    <User className="h-6 w-6" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                    aria-label="Login"
                  >
                    Login
                  </button>
                )}
              </motion.div>
            </div>

            {/* Mobile menu button - Removed */}
            <div className="lg:hidden w-6">
              {/* Empty div for spacing */}
            </div>

            {/* Mobile Right Side Icons */}
            <div className="lg:hidden flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Mobile Profile/Login Button */}
                {isUserLoggedIn ? (
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="p-2 text-gray-600 hover:text-purple-500"
                    aria-label="Profile"
                  >
                    <User className="h-6 w-6" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-3 py-1 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                    aria-label="Login"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
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
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

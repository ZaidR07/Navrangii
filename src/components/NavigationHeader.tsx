"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, X, Sparkles,  User, ShoppingCart, Search, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from '@/context/UserContext';
import { useCartCount } from '@/hooks/cart/useCartCount';
import { useWishlistCount } from '@/hooks/wishlist/useWishlistCount';
import { useGetVariable } from '@/hooks/variable/useGetVariable';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { useGetGeneralSettings } from "@/hooks/GeneralSettings/useGetGeneralSettings";

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { data: cartData, isLoading: isCartLoading } = useCartCount(userEmail || '');
  const { data: variablesData } = useGetVariable();

  // Sync userEmail from user context or cookie
  useEffect(() => {
    const email = user?.email || Cookies.get('userEmail') || null;
    setUserEmail(email);
  }, [user]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen) {
        const target = event.target as Element;
        if (!target.closest('.search-container')) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Get filtered search suggestions from variables
  const getSearchSuggestions = () => {
    if (!searchQuery || !variablesData) return [];
    
    const subCatergoryMap = variablesData.subCatergory || {};
    const allSubcategories = Object.values(subCatergoryMap).flat();
    
    const filtered = allSubcategories.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return filtered.slice(0, 8); // Limit to 8 suggestions
  };

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (category: string) => pathname.includes(`/category/${category}`);

  // Build dynamic sections from Variables data
  const sections = variablesData?.section || [];

  const { settings, isLoading: isSettingsLoading } = useGetGeneralSettings();

  // Get active news and offers from admin settings
  const newsItems = settings?.newsAndOffers?.filter(item => item.isActive) || [];

  return (
    <>
      {/* Top Announcement Bar / News Section */}
      <div className="fixed top-0 left-0 right-0 z-[110] bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 overflow-hidden h-10 flex items-center justify-center">
        <motion.div
          animate={{ x: [1000, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-4 text-xs font-medium"
        >
          {newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <Sparkles className="h-3 w-3" />
                <span>{item.title}{item.description ? `: ${item.description}` : ''}</span>
                {index < newsItems.length - 1 && <Sparkles className="h-3 w-3 ml-8" />}
              </React.Fragment>
            ))
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              <span>Welcome to Navrangi - Your Destination for Ethnic Wear!</span>
              <Sparkles className="h-3 w-3 ml-8" />
              <span>Easy Returns & Exchange - 7 Day Return Policy</span>
              <Sparkles className="h-3 w-3 ml-8" />
              <span>Free Shipping on Orders Above ₹1999!</span>
            </>
          )}
          {/* Repeat for continuous scroll if few items */}
          {newsItems.length > 0 && newsItems.length < 3 && newsItems.map((item, index) => (
            <React.Fragment key={`repeat-${item.id || index}`}>
              <Sparkles className="h-3 w-3 ml-8" />
              <span>{item.title}{item.description ? `: ${item.description}` : ''}</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <header className="fixed top-10 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                alt="Navrangi Logo"
                  width={720}
                  height={216}
                  priority
                  className="h-10 sm:h-14 lg:h-16 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Desktop & Tablet Navigation */}
            <div className="hidden sm:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-4 lg:space-x-8">
                <Link
                  href="/products?productType=onSale"
                  className="px-1 pt-1 text-xs lg:text-sm font-medium text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent transition-colors"
                >
                  On Sale
                </Link>

                <Link
                  href="/products?productType=bestSeller"
                  className="px-1 pt-1 text-xs lg:text-sm font-medium text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent transition-colors"
                >
                  Best Seller
                </Link>

                <Link
                  href="/products?sort=new"
                  className="px-1 pt-1 text-xs lg:text-sm font-medium text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent transition-colors"
                >
                  New Arrivals
                </Link>

                {sections.slice(0, 4).map((section: string) => (
                  <Link
                    key={section}
                    href={`/products?section=${encodeURIComponent(section)}`}
                    className={`px-1 pt-1 text-xs lg:text-sm font-medium transition-colors ${
                      isCategoryActive(section)
                        ? 'text-purple-600 border-b-2 border-purple-500'
                        : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                    }`}
                  >
                    {section}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Mobile menu button removed per user request */}

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4"
                >
                  {/* Search */}
                  <div className="relative search-container ">
                    <button
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="p-2 text-gray-600 hover:text-purple-500"
                      aria-label="Search"
                    >
                      <Search className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Rest of the desktop icons... */}

                  {/* Search Dropdown */}
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="search-container absolute text-black top-[110%] right-0 w-[calc(100vw-2rem)] sm:w-[400px] lg:w-[500px] bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                              window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                              setIsSearchOpen(false);
                            }
                          }}
                          placeholder="Search brands..."
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                          autoFocus
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Search Suggestions */}
                      {searchQuery && getSearchSuggestions().length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 max-h-60 overflow-y-auto">
                          <ul className="text-sm">
                            {getSearchSuggestions().map((suggestion, index) => (
                              <li 
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                                onClick={() => {
                                  window.location.href = `/products?subcategory=${encodeURIComponent(suggestion)}`;
                                }}
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {searchQuery && getSearchSuggestions().length === 0 && (
                        <div className="mt-3 text-center text-sm text-gray-500">
                          No suggestions found
                        </div>
                      )}
                      
                      {!searchQuery && (
                        <div className="mt-3 text-center text-sm text-gray-500">
                          Start typing to search brands
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  <WishlistIcon userEmail={userEmail} />
                  
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
                  
                  {isAuthenticated ? (
                    <div className="relative">
                      <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="p-2 text-gray-600 hover:text-purple-500"
                        aria-label="Profile"
                      >
                        <User className="h-6 w-6" />
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-44 z-50">
                          <button
                            onClick={() => { setShowUserMenu(false); window.location.href = '/profile'; }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="h-4 w-4" />
                            My Profile
                          </button>
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); window.location.href = '/'; }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
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

              {/* Mobile Icons (Search first, then Sign In/Profile) */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="relative search-container">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 text-gray-600 hover:text-purple-500"
                    aria-label="Search"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                  
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed left-0 right-0 top-26 sm:top-30 z-[110] px-4"
                    >
                      <div className="relative mx-auto w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                              window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                              setIsSearchOpen(false);
                            }
                          }}
                          placeholder="Search brands..."
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                          autoFocus
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {!isLoading && (
                  !isAuthenticated ? (
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="px-4 py-1.5 text-sm font-semibold text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors ml-1"
                    >
                      Sign In
                    </button>
                  ) : (
                    <Link 
                      href="/profile"
                      className="p-2 text-gray-600 hover:text-purple-500 transition-colors"
                      aria-label="Profile"
                    >
                      <User className="h-6 w-6" />
                    </Link>
                  )
                )}

                <Link 
                  href="/cart" 
                  className="relative p-2 text-gray-600 hover:text-purple-500 hidden"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {isCartLoading ? '0' : cartData?.count || 0}
                  </span>
                </Link>
                
                <div className="hidden">
                  <WishlistIcon userEmail={userEmail} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu content */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/products?productType=onSale"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                On Sale
              </Link>

              <Link
                href="/products?productType=bestSeller"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Best Seller
              </Link>

              <Link
                href="/products?sort=new"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>

              {sections.map((section: string) => (
                <Link
                  key={section}
                  href={`/products?section=${encodeURIComponent(section)}`}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isCategoryActive(section)
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, X, Sparkles, ChevronDown, ChevronUp, User, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoriesModal from "./CategoriesModal";
import { useAuth } from '@/context/UserContext';
import { useCartCount } from '@/hooks/cart/useCartCount';
import { useWishlistCount } from '@/hooks/wishlist/useWishlistCount';
import { useGetVariable } from '@/hooks/variable/useGetVariable';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWomenDropdownOpen, setIsWomenDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { data: cartData, isLoading: isCartLoading } = useCartCount(userEmail || '');
  const { data: variablesData } = useGetVariable();

  // Check if user is logged in by checking for email cookie - only on client side
  useEffect(() => {
    const email = Cookies.get('userEmail');
    setIsUserLoggedIn(!!email);
    setUserEmail(email || null);
  }, []);

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
    
    const allSubcategories = [
      ...(variablesData.subCatergory || [])
    ];
    
    const filtered = allSubcategories.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return filtered.slice(0, 8); // Limit to 8 suggestions
  };

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (category: string) => pathname.includes(`/category/${category}`);

  const categories = [
    { name: "New Arrivals", id: "NEW-ARRIVALS", href: "/#new-arrivals" },
    { name: "Festivals", id: "FESTIVALS" },
    { name: "Women", id: "WOMENS", hasDropdown: true },
    { name: "Men", id: "MENS" },
    { name: "Couple", id: "COUPLE" }
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
                alt="Navrangi Logo"
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
                  category.hasDropdown ? (
                    <div key={category.id} className="relative">
                      <button
                        className={`px-1 pt-1 text-sm font-medium flex items-center space-x-1 ${
                          isCategoryActive(category.id)
                            ? 'text-purple-600 border-b-2 border-purple-500'
                            : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                        }`}
                        onClick={() => setIsWomenDropdownOpen(!isWomenDropdownOpen)}
                      >
                        <span>{category.name}</span>
                        {isWomenDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      
                      {/* Women Dropdown */}
                      {isWomenDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        >
                          <Link
                            href="/products?category=JEWELRY"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            onClick={() => setIsWomenDropdownOpen(false)}
                          >
                            Jewelry
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={category.id}
                      href={category.href || `/products?category=${category.id}`}
                      className={`px-1 pt-1 text-sm font-medium ${
                        isCategoryActive(category.id)
                          ? 'text-purple-600 border-b-2 border-purple-500'
                          : 'text-gray-700 hover:text-purple-600 hover:border-purple-300 border-b-2 border-transparent'
                      }`}
                    >
                      {category.name}
                    </Link>
                  )
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

                {/* Search Dropdown */}
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="search-container absolute text-black top-32 left-[4%] right-[4%]  mx-auto max-w-7xl bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                      
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search brands..."
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                  // Navigate to products page with subcategory filter
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
                {/* Mobile Search */}
                <div className="relative search-container">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 text-gray-600 hover:text-purple-500"
                    aria-label="Search"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                  
                  {/* Mobile Search Dropdown */}
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-7xl bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                      style={{ left: '50%', marginLeft: '-16px', marginRight: '-16px' }}
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search brands..."
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                  // Navigate to products page with subcategory filter
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
                </div>
                
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
                category.hasDropdown ? (
                  <div key={category.id}>
                    <button
                      className={`w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center justify-between ${
                        isCategoryActive(category.id)
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                      }`}
                      onClick={() => setIsWomenDropdownOpen(!isWomenDropdownOpen)}
                    >
                      <span>{category.name}</span>
                      {isWomenDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    
                    {/* Mobile Women Dropdown */}
                    {isWomenDropdownOpen && (
                      <div className="pl-8 pr-4 py-2 bg-gray-50">
                        <Link
                          href="/products?category=JEWELRY"
                          className="block py-2 text-sm text-gray-600 hover:text-purple-600"
                          onClick={() => {
                            setIsWomenDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Jewelry
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={category.id}
                    href={category.href || `/products?category=${category.id}`}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isCategoryActive(category.id)
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                )
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

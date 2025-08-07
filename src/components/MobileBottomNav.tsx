"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Heart, User, ShoppingCart, Menu } from "lucide-react";
import Link from "next/link";
import CategoriesModal from "./CategoriesModal";
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/UserContext';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';

interface BottomNavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: BottomNavItem[] = [
  { id: "home", icon: <Home className="h-6 w-6" />, label: "Home", href: "/" },
  { id: "categories", icon: <Menu className="h-6 w-6" />, label: "Categories", href: "#" },
  { id: "wishlist", icon: <Heart className="h-6 w-6" />, label: "Wishlist", href: "/wishlist" },
  { id: "cart", icon: <ShoppingCart className="h-6 w-6" />, label: "Cart", href: "/cart" },
];

export default function MobileBottomNav() {
  const [activeItem, setActiveItem] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  
  // Check if user is logged in by checking for email cookie
  const isUserLoggedIn = !!Cookies.get('userEmail');

  const handleCategoryClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleProfileClick = () => {
    if (isUserLoggedIn) {
      // Redirect to profile page or show user menu
      window.location.href = '/profile';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg ${
                activeItem === item.id
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              onClick={() => {
                setActiveItem(item.id);
                if (item.id === "categories") {
                  handleCategoryClick();
                } else if (item.id === "wishlist") {
                  window.location.href = '/wishlist';
                }
              }}
            >
              <div className="relative">
                {item.icon}
                {item.id === "cart" && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                )}
                {item.id === "wishlist" && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Modal */}
      <CategoriesModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Heart, User, ShoppingCart, LogOut, Package, Grid, Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useWishlistCount } from '@/hooks/wishlist/useWishlistCount';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';
import { useGetVariable } from '@/hooks/variable/useGetVariable';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface BottomNavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function MobileBottomNav() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("home");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const userEmail = user?.email || Cookies.get('userEmail') || '';
  const { data: wishlistCountData } = useWishlistCount(userEmail);
  const { data: variables } = useGetVariable();
  const { data: products = [] } = useGetAllProducts();

  const sections = variables?.section || [];

  // Filter sections to only show those that HAVE products
  const availableSections = useMemo(() => {
    const hasProducts = new Set<string>();
    products.forEach((product: any) => {
      if (product.section) {
        hasProducts.add(product.section);
      }
    });
    // Only return sections that exist in variables AND have products
    return sections.filter(section => hasProducts.has(section));
  }, [sections, products]);

  // Map special sections and categories to their first available product image
  const categoryImages = useMemo(() => {
    const mapping: Record<string, string> = {};
    
    // Find first onSale product for the special section
    const onSaleProduct = products.find((p: any) => p.productType === 'onSale');
    if (onSaleProduct) mapping['onSale'] = onSaleProduct.variants?.[0]?.thumbnail || onSaleProduct.image || '';
    
    // Find first bestSeller product for the special section
    const bestSellerProduct = products.find((p: any) => p.productType === 'bestSeller');
    if (bestSellerProduct) mapping['bestSeller'] = bestSellerProduct.variants?.[0]?.thumbnail || bestSellerProduct.image || '';
    
    // Find newest product for the special section
    const newArrivalProduct = [...products].sort((a: any, b: any) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )[0];
    if (newArrivalProduct) mapping['newArrival'] = newArrivalProduct.variants?.[0]?.thumbnail || newArrivalProduct.image || '';
    
    // Also map regular sections to their first available product image
    products.forEach((product: any) => {
      if (product.section && !mapping[product.section]) {
        const imageUrl = product.variants?.[0]?.thumbnail || product.image;
        if (imageUrl) {
          mapping[product.section] = imageUrl;
        }
      }
    });

    return mapping;
  }, [products]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[2000] pb-safe">
        <div className="flex justify-around items-center h-20 px-4">
          {/* Wishlist Button */}
          <Link href="/wishlist" className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
            <Heart className="h-6 w-6 text-gray-600" />
            <span className="text-[10px] mt-1 text-gray-500 font-medium">Wishlist</span>
          </Link>

          {/* Categories Modal Toggle */}
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-600 shadow-lg shadow-pink-200 -mt-8 border-4 border-white"
          >
            <Grid className="h-8 w-8 text-white" />
          </button>

          {/* Cart Button */}
          <Link href="/cart" className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 text-gray-500 font-medium">Cart</span>
          </Link>
        </div>
      </div>

      {/* Categories Grid Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Browse Menu</h2>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex flex-col gap-6">
              {/* Main Menu Links (Dynamic from Top Nav Bar) */}
              <div className="grid grid-cols-2 gap-4">
                {/* On Sale */}
                <div 
                  onClick={() => {
                    router.push('/products?productType=onSale');
                    setIsCategoryModalOpen(false);
                  }}
                  className={`group cursor-pointer ${!categoryImages['onSale'] ? 'hidden' : ''}`}
                >
                  <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-3 border border-pink-100 shadow-sm group-active:scale-95 transition-all relative p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <Image 
                        src={categoryImages['onSale']} 
                        fill
                        sizes="45vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="On Sale"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-xl">🔥</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    On Sale
                  </p>
                </div>

                {/* Best Seller */}
                <div 
                  onClick={() => {
                    router.push('/products?productType=bestSeller');
                    setIsCategoryModalOpen(false);
                  }}
                  className={`group cursor-pointer ${!categoryImages['bestSeller'] ? 'hidden' : ''}`}
                >
                  <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-3 border border-pink-100 shadow-sm group-active:scale-95 transition-all relative p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <Image 
                        src={categoryImages['bestSeller']} 
                        fill
                        sizes="45vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Bestsellers"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-xl">⭐</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    Bestsellers
                  </p>
                </div>

                {/* New Arrivals */}
                <div 
                  onClick={() => {
                    router.push('/products?sort=new');
                    setIsCategoryModalOpen(false);
                  }}
                  className={`group cursor-pointer ${!categoryImages['newArrival'] ? 'hidden' : ''}`}
                >
                  <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-3 border border-pink-100 shadow-sm group-active:scale-95 transition-all relative p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <Image 
                        src={categoryImages['newArrival']} 
                        fill
                        sizes="45vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="New Arrivals"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    New Arrivals
                  </p>
                </div>

                {/* Regular Dynamic Categories from Nav Bar Data */}
                {availableSections.map((section: any) => (
                  <div 
                    key={section}
                    onClick={() => {
                      router.push(`/products?section=${encodeURIComponent(section)}`);
                      setIsCategoryModalOpen(false);
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-3 border border-pink-100 shadow-sm group-active:scale-95 transition-all relative p-1">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <Image 
                          src={categoryImages[section] || 'https://images.unsplash.com/photo-1618333234901-b358a5bc200e?q=80&w=300&auto=format&fit=crop'}
                          alt={section}
                          fill
                          sizes="45vw"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                      {section}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

"use client";

import { useEffect } from "react";
import axios from "axios";
import NoticeBar from "@/components/NoticeBar";
import NavigationHeader from "@/components/NavigationHeader";
import HeroCarousel from "@/components/HeroCarousel";
import SaleSection from "@/components/SaleSection";
import HimHerSection from "@/components/HimHerSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellingProducts from "@/components/BestSellingProducts";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function HomePage() {
  // Keep server alive
  useEffect(() => {
    const keepServerAlive = () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (backendUrl) {
        axios.get(`${backendUrl}/api/keep-alive`)
          .then(() => console.log('Keep-alive ping sent'))
          .catch(() => console.log('Keep-alive ping failed'));
      }
    };

    keepServerAlive();
    const interval = setInterval(keepServerAlive, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      <NoticeBar />
      <NavigationHeader />
      <HeroCarousel />
      <SaleSection />
      <HimHerSection />
      <CategoriesSection />
      <BestSellingProducts />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

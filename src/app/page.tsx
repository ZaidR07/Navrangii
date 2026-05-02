"use client";

import React from "react";
import axios from "axios";

import NoticeBar from "@/components/NoticeBar";
import NavigationHeader from "@/components/NavigationHeader";
import HeroCarousel from "@/components/HeroCarousel";
import SaleSection from "@/components/SaleSection";
import HimHerSection from "@/components/HimHerSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import CategoriesSection from "@/components/CategoriesSection";
import BestSellingProducts from "@/components/BestSellingProducts";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useGetAllProducts } from "@/hooks/product/useGetProduct";

export default function HomePage() {
  const { data: products = [], isLoading, error: productsError } = useGetAllProducts();

  const saleProducts = React.useMemo(() => {
    const byType = products.filter((p) => p.productType === "onSale");
    if (byType.length > 0) return byType;

    // fallback: old behavior (category contains SALE)
    return products.filter(
      (product) => product.category && product.category.toUpperCase().includes("SALE")
    );
  }, [products]);

  // Use the hook's loading and error states
  const loading = isLoading;
  const error = productsError?.message || null;

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0 overflow-x-hidden">
      <NoticeBar />
      <NavigationHeader />
      <HeroCarousel />
      <SaleSection products={saleProducts} loading={loading} error={error} />
      <HimHerSection />
      <section id="new-arrivals">
        <NewArrivalsSection />

      </section>
      <CategoriesSection />
      <BestSellingProducts />
      <FAQSection />
      <TestimonialsSection />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

/* app/(pages)/dashboard/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import StatCard from "@/components/stat-card";
import { TopProductTable } from "@/components/top-product-table";
import { dummyProducts } from "@/lib/constants/dashboardSliderData";
import { useGetStatsData } from "@/hooks/dashboard/useGetStatsData";
import { useGetPieStatsData } from "@/hooks/dashboard/useGetPieStatsData";
import { useGetEarningData } from "@/hooks/dashboard/useGetEarningData";
import PageError from "@/components/page-error";
import PageLoading from "@/components/page-loading";
import GraphDiagram from "@/components/graph-diagram";
import PieDiagram from "@/components/pie-diagram";

export default function Dashboard() {
  const { data: statsCardData, isError: statsError, isLoading: statsIsLoading } = useGetStatsData();
  const { data: pieStatsData, isError: pieStatsError, isLoading: pieStatsIsLoading } = useGetPieStatsData();
  const { data: yearlyEarnings, isError: yearlyEarningsError, isLoading: yearlyEarningsIsLoading } = useGetEarningData();
  const [size, setSize] = useState<"sm" | "md" | "xs">("sm");



  useEffect(() => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1240,
      xl: 1440,
    }
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= breakpoints.xl) {
        setSize("md");
      }else if(width >= breakpoints.lg) {
        setSize("sm");
      }else if(width >= breakpoints.md) {
        setSize("xs");
      }
    };

    updateSize(); // initial run
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);


  if (statsIsLoading || pieStatsIsLoading || yearlyEarningsIsLoading) {
    return <PageLoading />;
  }

  if (statsError || !statsCardData || pieStatsError || !pieStatsData || yearlyEarningsError || !yearlyEarnings) {
    return <PageError />;
  }

  return (
    <div className="min-h-screen ` bg-gradient-to-br from-slate-50 to-purple-100/40 p-4 sm:p-6 dark:from-slate-900 dark:to-purple-900/40">
      <div className="mx-auto w-full  space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Welcome back! Here’s what’s happening with your business today.
            </p>
          </div>

        </header>

        {/* Stat Cards Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="TODAY'S ORDERS"
            today={statsCardData.orders.today}
            yesterday={statsCardData.orders.yesterday}
            week={statsCardData.orders.week}
            month={statsCardData.orders.month}
            icon={Package}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="SALES"
            today={statsCardData.sales.today}
            yesterday={statsCardData.sales.yesterday}
            week={statsCardData.sales.week}
            month={statsCardData.sales.month}
            icon={DollarSign}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            title="PRODUCTS"
            today={statsCardData.products.today}
            yesterday={statsCardData.products.yesterday}
            week={statsCardData.products.week}
            month={statsCardData.products.month}
            icon={ShoppingCart}
            color="from-yellow-500 to-orange-600"
          />
          <StatCard
            title="VISITORS"
            today={statsCardData.visitors.today}
            yesterday={statsCardData.visitors.yesterday}
            week={statsCardData.visitors.week}
            month={statsCardData.visitors.month}
            icon={Users}
            color="from-blue-500 to-indigo-600"
          />
        </section>

        {/* Graph + Pie Row split in half */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <GraphDiagram
              title="Yearly Earnings"
              data={yearlyEarnings}
              xKey="month"
              yKey="earnings"
              color="#8b5cf6"
              yFormatter={(value) => {
                if (value >= 100000) return `${(value / 100000).toFixed(2)}L`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value.toString();
              }} // optional
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PieDiagram statusData={pieStatsData.orders} title="Orders" size={size} showLegend showIcon />
            <PieDiagram statusData={pieStatsData.complaint} title="Complaints" size={size} showLegend showIcon />
            <PieDiagram statusData={pieStatsData.visitors} title="Visitors" size={size} showLegend showIcon />
            <PieDiagram statusData={pieStatsData.customers} title="Customers" size={size} showLegend showIcon />
          </div>
        </section>

        {/* Top Products and Stock */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>

            <TopProductTable products={dummyProducts} />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Stock</h2>
            <div className="text-slate-500 dark:text-slate-400">Stock overview coming soon...</div>
          </div>
        </section>
      </div>
    </div>
  );
}

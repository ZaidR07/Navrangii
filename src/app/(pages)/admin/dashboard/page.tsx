/* app/(pages)/dashboard/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import GraphDiagram from "@/components/graph-diagram";
import PieDiagram from "@/components/pie-diagram";

export default function Dashboard() {
  const { 
    data: statsCardData, 
    isError: statsError, 
    isLoading: statsIsLoading,
    error: statsErrorObj
  } = useGetStatsData();
  
  const { 
    data: pieStatsData, 
    isError: pieStatsError, 
    isLoading: pieStatsIsLoading,
    error: pieStatsErrorObj
  } = useGetPieStatsData();
  
  const { 
    data: yearlyEarnings, 
    isError: yearlyEarningsError, 
    isLoading: yearlyEarningsIsLoading,
    error: yearlyEarningsErrorObj
  } = useGetEarningData();
  
  const [size, setSize] = useState<"sm" | "md" | "xs">("sm");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Show toast notifications for errors
  useEffect(() => {
    if (statsError) {
      toast.error(`Failed to load stats: ${statsErrorObj?.message || 'Unknown error'}`);
    }
    if (pieStatsError) {
      toast.error(`Failed to load pie stats: ${pieStatsErrorObj?.message || 'Unknown error'}`);
    }
    if (yearlyEarningsError) {
      toast.error(`Failed to load earnings data: ${yearlyEarningsErrorObj?.message || 'Unknown error'}`);
    }
  }, [statsError, pieStatsError, yearlyEarningsError, statsErrorObj, pieStatsErrorObj, yearlyEarningsErrorObj]);

  // Handle loading state
  useEffect(() => {
    const loading = (statsIsLoading && !statsCardData) || 
                  (pieStatsIsLoading && !pieStatsData) || 
                  (yearlyEarningsIsLoading && !yearlyEarnings) || 
                  !mounted;
    
    if (loading) {
      setIsLoading(true);
      const toastId = toast.loading('Loading dashboard data...');
      return () => toast.dismiss(toastId);
    } else {
      setIsLoading(false);
    }
  }, [statsIsLoading, pieStatsIsLoading, yearlyEarningsIsLoading, statsCardData, pieStatsData, yearlyEarnings, mounted]);

  // Handle window resize
  useEffect(() => {
    setMounted(true);
    
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1240,
      xl: 1440,
    };
    
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= breakpoints.xl) {
        setSize("md");
      } else if (width >= breakpoints.lg) {
        setSize("sm");
      } else if (width >= breakpoints.md) {
        setSize("xs");
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Show loading overlay if any data is still loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100/40 p-4 sm:p-6 dark:from-slate-900 dark:to-purple-900/40">
      <ToastContainer />
      <div className="mx-auto w-full space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCardData && statsCardData.orders && statsCardData.sales && statsCardData.products && statsCardData.customers ? (
            [
              {
                title: "Total Orders",
                value: (statsCardData.orders.month || 0).toString(),
                icon: ShoppingCart,
                change: `${Math.round(
                  ((statsCardData.orders.today || 0) - (statsCardData.orders.yesterday || 0)) / 
                    Math.max(statsCardData.orders.yesterday || 1, 1) * 100
                )}% from yesterday`,
                changeType: (statsCardData.orders.today || 0) > (statsCardData.orders.yesterday || 0) ? 'increase' : 'decrease'
              },
              {
                title: "Total Sales",
                value: `₹${(statsCardData.sales.month || 0).toLocaleString()}`,
                icon: DollarSign,
                change: `${Math.round(
                  ((statsCardData.sales.today || 0) - (statsCardData.sales.yesterday || 0)) / 
                    Math.max(statsCardData.sales.yesterday || 1, 1) * 100
                )}% from yesterday`,
                changeType: (statsCardData.sales.today || 0) > (statsCardData.sales.yesterday || 0) ? 'increase' : 'decrease'
              },
              {
                title: "Products in Stock",
                value: (statsCardData.products.month || 0).toString(),
                icon: Package,
                change: `${Math.round(
                  ((statsCardData.products.today || 0) - (statsCardData.products.yesterday || 0)) / 
                    Math.max(statsCardData.products.yesterday || 1, 1) * 100
                )}% from yesterday`,
                changeType: (statsCardData.products.today || 0) > (statsCardData.products.yesterday || 0) ? 'increase' : 'decrease'
              },
              {
                title: "Active Customers",
                value: (statsCardData.customers.month || 0).toString(),
                icon: Users,
                change: `${Math.round(
                  ((statsCardData.customers.today || 0) - (statsCardData.customers.yesterday || 0)) / 
                    Math.max(statsCardData.customers.yesterday || 1, 1) * 100
                )}% from yesterday`,
                changeType: (statsCardData.customers.today || 0) > (statsCardData.customers.yesterday || 0) ? 'increase' : 'decrease'
              },
            ].map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                changeType={stat.changeType}
              />
            ))
          ) : (
            // Show placeholders if data failed to load
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            ))
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sales Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sales Overview
            </h3>
            {yearlyEarnings ? (
              <GraphDiagram data={yearlyEarnings} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                Sales data not available
              </div>
            )}
          </div>

          {/* Pie Charts */}
          <div className="space-y-6">
            {pieStatsData ? (
              <>
                <PieDiagram statusData={pieStatsData.orders} title="Orders" size={size} showLegend showIcon />
                <PieDiagram statusData={pieStatsData.customers} title="Customers" size={size} showLegend showIcon />
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                Statistics not available
              </div>
            )}
          </div>
        </div>

        {/* Top Products and Stock */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <TopProductTable products={dummyProducts} />
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Stock Overview
            </h2>
            <div className="mt-4 text-slate-600 dark:text-slate-400">
              Stock data coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

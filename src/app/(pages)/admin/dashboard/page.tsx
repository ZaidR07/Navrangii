/* app/(pages)/dashboard/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import StatCard from "@/components/stat-card";
import { TopProductTable } from "@/components/top-product-table";
import { useGetStatsData } from "@/hooks/dashboard/useGetStatsData";
import { useGetPieStatsData } from "@/hooks/dashboard/useGetPieStatsData";
import { useGetEarningData } from "@/hooks/dashboard/useGetEarningData";
import { useGetTopProducts } from "@/hooks/dashboard/useGetTopProducts";
import { useGetStockOverview } from "@/hooks/dashboard/useGetStockOverview";
import GraphDiagram from "@/components/graph-diagram";
import PieDiagram from "@/components/pie-diagram";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonStatCard, SkeletonTable } from "@/components/skeletons/admin-skeletons";
import { AlertTriangle, TrendingDown } from "lucide-react";

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

  const {
    data: topProducts,
    isError: topProductsError,
    isLoading: topProductsIsLoading,
    error: topProductsErrorObj,
  } = useGetTopProducts();

  const {
    data: stockData,
    isError: stockError,
    isLoading: stockIsLoading,
    error: stockErrorObj,
  } = useGetStockOverview();
  
  const [size, setSize] = useState<"sm" | "md" | "xs">("sm");

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
    if (topProductsError) {
      toast.error(`Failed to load top products: ${topProductsErrorObj?.message || 'Unknown error'}`);
    }
    if (stockError) {
      toast.error(`Failed to load stock data: ${stockErrorObj?.message || 'Unknown error'}`);
    }
  }, [statsError, pieStatsError, yearlyEarningsError, topProductsError, stockError, statsErrorObj, pieStatsErrorObj, yearlyEarningsErrorObj, topProductsErrorObj, stockErrorObj]);

  // Handle window resize
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100/40 p-4 sm:p-6 dark:from-slate-900 dark:to-purple-900/40">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
          {statsIsLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
            : [
                {
                  title: "Total Orders",
                  value: (statsCardData?.orders?.month || 0).toString(),
                  icon: ShoppingCart,
                  change: `${Math.round(
                    ((statsCardData?.orders?.today || 0) - (statsCardData?.orders?.yesterday || 0)) /
                      Math.max(statsCardData?.orders?.yesterday || 1, 1) * 100
                  )}% from yesterday`,
                  changeType: (statsCardData?.orders?.today || 0) > (statsCardData?.orders?.yesterday || 0) ? "increase" : "decrease" as "increase" | "decrease"
                },
                {
                  title: "Total Sales",
                  value: `₹${(statsCardData?.sales?.month || 0).toLocaleString()}`,
                  icon: DollarSign,
                  change: `${Math.round(
                    ((statsCardData?.sales?.today || 0) - (statsCardData?.sales?.yesterday || 0)) /
                      Math.max(statsCardData?.sales?.yesterday || 1, 1) * 100
                  )}% from yesterday`,
                  changeType: (statsCardData?.sales?.today || 0) > (statsCardData?.sales?.yesterday || 0) ? "increase" : "decrease" as "increase" | "decrease"
                },
                {
                  title: "Products in Stock",
                  value: (statsCardData?.products?.month || 0).toString(),
                  icon: Package,
                  change: `${Math.round(
                    ((statsCardData?.products?.today || 0) - (statsCardData?.products?.yesterday || 0)) /
                      Math.max(statsCardData?.products?.yesterday || 1, 1) * 100
                  )}% from yesterday`,
                  changeType: (statsCardData?.products?.today || 0) > (statsCardData?.products?.yesterday || 0) ? "increase" : "decrease" as "increase" | "decrease"
                },
                {
                  title: "Active Customers",
                  value: (statsCardData?.customers?.month || 0).toString(),
                  icon: Users,
                  change: `${Math.round(
                    ((statsCardData?.customers?.today || 0) - (statsCardData?.customers?.yesterday || 0)) /
                      Math.max(statsCardData?.customers?.yesterday || 1, 1) * 100
                  )}% from yesterday`,
                  changeType: (statsCardData?.customers?.today || 0) > (statsCardData?.customers?.yesterday || 0) ? "increase" : "decrease" as "increase" | "decrease"
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
              ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sales Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sales Overview
            </h3>
            {yearlyEarningsIsLoading ? (
              <Skeleton className="h-64 w-full mt-4" />
            ) : yearlyEarnings ? (
              <GraphDiagram data={yearlyEarnings} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                Sales data not available
              </div>
            )}
          </div>

          {/* Pie Charts */}
          <div className="space-y-6">
            {pieStatsIsLoading ? (
              <>
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </>
            ) : pieStatsData ? (
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
            {topProductsIsLoading ? (
              <SkeletonTable columns={4} rows={5} />
            ) : topProducts && topProducts.length > 0 ? (
              <TopProductTable products={topProducts} />
            ) : (
              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top Selling Products</h2>
                <div className="mt-4 text-slate-600 dark:text-slate-400">No sales data available yet.</div>
              </div>
            )}
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Stock Overview
            </h2>
            {stockIsLoading ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : stockData ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <Package className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stockData.totalProducts}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Total Products</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stockData.outOfStock}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">Out of Stock</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stockData.lowStock}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Low Stock</p>
                  </div>
                </div>
                {stockData.lowStockProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Low Stock Items</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {stockData.lowStockProducts.map((product: any) => (
                        <div key={product._id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 relative flex-shrink-0">
                            <Image src={product.thumbnail} alt={product.name} fill sizes="40px" className="object-cover rounded border" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{product.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{product.totalStock} left in stock</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-slate-600 dark:text-slate-400">Stock data not available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

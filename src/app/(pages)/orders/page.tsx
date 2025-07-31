"use client"

import { useState } from "react"
import {
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHasMounted } from "@/lib/useHasMounted"
import type { Order } from "@/lib/types/orderType"
import KPICard from "@/components/kpl-card"

import { mockOrders } from "@/lib/constants/ordersData"
import OrdersListTab from "@/components/orders-list"
import DistributorAssignment from "@/components/delivery-partner-assignment"




const getStatusColor = (orderStatusUpdate: Order["orderStatusUpdate"]) => {
  switch (orderStatusUpdate.status) {
    case "pending":
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
    case "confirmed":
      return "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
    case "processing":
      return "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
    case "shipped":
      return "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
    case "delivered":
      return "bg-gradient-to-r from-green-400 to-green-500 text-white"
    case "cancelled":
      return "bg-gradient-to-r from-red-400 to-red-500 text-white"
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const hasMounted = useHasMounted()
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((order) => order.orderStatusUpdate.status === "pending").length
  const deliveredOrders = orders.filter((order) => order.orderStatusUpdate.status === "delivered").length

 

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Order Management System
        </h1>
        <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Track and manage all customer orders efficiently
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="h-9 w-9 text-slate-200" />}
          subtitle={"All orders listed"}
          color="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Total Revenue"
          value={
            hasMounted
              ? totalRevenue.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })
              : `$${totalRevenue.toFixed(2)}`
          }
          icon={<DollarSign className="h-9 w-9 text-slate-200" />}
          subtitle="Total sales value"
          color="from-green-500 to-emerald-600"
        />
        <KPICard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="h-9 w-9 text-slate-200" />}
          subtitle="Awaiting processing"
          color="from-yellow-500 to-orange-600"
        />
        <KPICard
          title="Delivered Orders"
          value={deliveredOrders}
          icon={<CheckCircle className="h-9 w-9 text-slate-200" />}
          subtitle="Successfully completed"
          color="from-blue-500 to-cyan-600"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-violet-100">
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Orders Overview
          </TabsTrigger>
          <TabsTrigger
            value="assignment"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Distributor Assignment
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <OrdersListTab orders={orders} getStatusColor={getStatusColor} />
      

        {/* Distributor Assignment Tab */}
       <DistributorAssignment orders={orders} getStatusColor={getStatusColor} setOrders={setOrders}/>
      </Tabs>
    </div>
  )
}

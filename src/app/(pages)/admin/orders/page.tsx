"use client"

import { useState, useEffect } from "react"
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

import { useGetOrders } from "@/hooks/order/useGetOrders"
import OrdersListTab from "@/components/orders-list"
import DistributorAssignment from "@/components/delivery-partner-assignment"




const getStatusColor = (orderStatusUpdate: Order["orderStatusUpdate"]) => {
  switch (orderStatusUpdate?.status) {
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
    case "return_request":
      return "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
    case "returned":
      return "bg-gradient-to-r from-rose-400 to-rose-500 text-white"
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }
}

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useGetOrders()
  const [orders, setOrders] = useState<Order[]>([])
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (ordersData?.orders) {
      // Transform API data to match Order type (enrichment done server-side)
      const transformedOrders = ordersData.orders.map((order: any) => ({
        ...order,
        customerName: order.customerName || order.userEmail?.split('@')[0] || 'Unknown',
        customerEmail: order.customerEmail || order.userEmail || 'N/A',
        orderStatusUpdate: order.orderStatusUpdate || {
          status: order.status || "pending",
          paymentStatus: order.status === "paid" ? "paid" : "pending",
        },
        items: order.items || [],
        subtotal: order.subtotal || order.total || 0,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,
        shippingAddress: order.shippingAddress || order.address || {},
        paymentDetails: order.paymentDetails || {
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: order.razorpayPaymentId,
          verified: true,
        },
        paymentMethod: order.paymentMethod || "Razorpay",
        assignedDeliveryPartner: order.assignedDeliveryPartner,
        assignedDate: order.assignedDate,
        orderDate: order.orderDate || order.createdAt,
        createdAt: order.createdAt,
      }))
      setOrders(transformedOrders)
    }
  }, [ordersData])

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((order) => order.orderStatusUpdate?.status === "pending").length
  const deliveredOrders = orders.filter((order) => order.orderStatusUpdate?.status === "delivered").length

 

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
              : `₹${totalRevenue.toFixed(2)}`
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <OrdersListTab orders={orders} getStatusColor={getStatusColor} setOrders={setOrders} />
        )}
      

        {/* Distributor Assignment Tab */}
       <DistributorAssignment orders={orders} getStatusColor={getStatusColor} setOrders={setOrders}/>
      </Tabs>
    </div>
  )
}

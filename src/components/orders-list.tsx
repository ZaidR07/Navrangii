// Shorter version of OrdersListTab using same logic and layout
"use client"

import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Edit3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TabsContent} from "@/components/ui/tabs"
import Image from "next/image"
import { OrdersListTabProps } from "@/lib/types/reactComponentsProps"
import { Order } from "@/lib/types/orderType"
import { useState } from "react"


const getStatusIcon = (status: Order["orderStatusUpdate"]) => {
  const icons: Record<string, any> = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
    return_request: Clock,
    returned: XCircle,
  }
  const statusValue = status?.status || 'pending'
  const Icon = icons[statusValue] || Clock
  return <Icon className="h-4 w-4" />
}

export default function OrdersListTab({getStatusColor,orders,setOrders}: OrdersListTabProps & {setOrders?: React.Dispatch<React.SetStateAction<Order[]>>}) {
      const [searchTerm, setSearchTerm] = useState("")
      const [statusFilter, setStatusFilter] = useState<string>("all")
      const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
      const [statusDialogOpen, setStatusDialogOpen] = useState(false)
      const [selectedStatus, setSelectedStatus] = useState<string>("")
      const getEffectiveStatus = (order: Order) => {
        const rawStatus = (order.orderStatusUpdate?.status as string | undefined) || "pending"
        const paymentStatus = (order.orderStatusUpdate?.paymentStatus as string | undefined) || "pending"

        // Some data sources store the status as "paid". For the admin flow, once paid we treat it as confirmed.
        if (paymentStatus === "paid" || rawStatus === "paid") {
          if (rawStatus === "pending" || rawStatus === "paid") return "confirmed"
        }

        return rawStatus
      }
      const filteredOrders = orders.filter((order) => {
  const name = order.customerName || ""
  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus = statusFilter === "all" || getEffectiveStatus(order) === statusFilter

  return matchesSearch && matchesStatus
})

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (setOrders) {
          setOrders(prev => prev.map(order => 
            order._id === orderId 
              ? { ...order, orderStatusUpdate: { ...(order.orderStatusUpdate || {}), status: newStatus as any } }
              : order
          ))
        }
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the status');
    }
    setStatusDialogOpen(false)
  }

  const getOrderNumber = (index: number) => {
    return (index + 1).toString().padStart(3, '0')
  }

  return (
    <div>
      <TabsContent value="orders" className="space-y-6">
        <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border-white dark:from-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search orders, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-800 border-white dark:border-slate-700 text-slate-800 dark:text-white focus-visible:ring-purple-700"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="min-w-[9rem] bg-gradient-to-r from-purple-500 to-purple-600 border-white text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-r from-violet-400 to-purple-500 border-white dark:from-slate-900">
                    {["all", "confirmed", "shipped", "return_request", "returned", "delivered"].map((status) => (
                      <SelectItem key={status} value={status} className="text-white">
                        {status === 'return_request' ? 'Return Request' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-200 dark:border-purple-800/50">
                    {["Order No", "Customer Name", "Mobile", "Status", "Total", "Actions"].map(header => (
                      <TableHead key={header} className="text-gray-900 dark:text-white font-semibold">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <TableRow key={order._id} className="border-purple-100/50 dark:border-purple-900/30 hover:bg-purple-50/30 dark:hover:bg-purple-900/20">
                      <TableCell>
                        <div className="font-semibold text-gray-900 dark:text-white">#{getOrderNumber(index)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{order.shippingAddress?.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor({ ...(order.orderStatusUpdate || { status: 'pending' }), status: getEffectiveStatus(order) as any })} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon({ ...(order.orderStatusUpdate || { status: 'pending' }), status: getEffectiveStatus(order) as any })}
                            {getEffectiveStatus(order).charAt(0).toUpperCase() + getEffectiveStatus(order).slice(1)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* View Order Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700"
                              >
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-white">
                                Order Details 
                              </DialogTitle>
                            </DialogHeader>
                             {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Order Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 dark:border-purple-800">
                                      <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                          <Users className="h-5 w-5" />
                                          Customer Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2 text-sm">
                                        <p>
                                          <strong className="text-gray-900 dark:text-white">Name:</strong>{" "}
                                          {selectedOrder.customerName}
                                        </p>
                                        <p>
                                          <strong className="text-gray-900 dark:text-white">Order Date:</strong>{" "}
                                          {(() => {
                                            const date = new Date(selectedOrder.orderDate);
                                            const day = date.getDate().toString().padStart(2, '0');
                                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}/${month}/${year}`;
                                          })()}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                                      <CardHeader>
                                        <CardTitle className="text-blue-800 dark:text-blue-200 text-lg flex items-center gap-2">
                                          <Package className="h-5 w-5" />
                                          Order Status
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <Badge className={getStatusColor(selectedOrder.orderStatusUpdate || { status: 'pending' })}>
                                          <div className="flex items-center gap-1">
                                            {getStatusIcon(selectedOrder.orderStatusUpdate || { status: 'pending' })}
                                            {(selectedOrder.orderStatusUpdate?.status || 'pending').charAt(0).toUpperCase() +
                                              (selectedOrder.orderStatusUpdate?.status || 'pending').slice(1)}
                                          </div>
                                        </Badge>
                                        <p className="text-sm">
                                          <strong className="text-blue-700 dark:text-blue-300">Payment:</strong>{" "}
                                          {selectedOrder.orderStatusUpdate?.paymentStatus || 'N/A'}
                                        </p>
                                        {selectedOrder.orderStatusUpdate?.trackingNumber && (
                                          <p className="text-sm">
                                            <strong className="text-blue-700 dark:text-blue-300">Tracking:</strong>{" "}
                                            {selectedOrder.orderStatusUpdate.trackingNumber}
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Separator className="bg-purple-200 dark:bg-purple-800" />

                                  {/* Shipping Address */}
                                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:border-green-800">
                                    <CardHeader>
                                      <CardTitle className="text-green-800 dark:text-green-200 text-lg flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Shipping Address
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                      {selectedOrder.shippingAddress ? (
                                        <>
                                          <p>{selectedOrder.shippingAddress.fullName}</p>
                                          <p>{selectedOrder.shippingAddress.addressLine1}</p>
                                          {selectedOrder.shippingAddress.addressLine2 && (
                                            <p>{selectedOrder.shippingAddress.addressLine2}</p>
                                          )}
                                          <p>
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                                            {selectedOrder.shippingAddress.postalCode}
                                          </p>
                                          <p>{selectedOrder.shippingAddress.country}</p>
                                          <p>{selectedOrder.shippingAddress.phone}</p>
                                        </>
                                      ) : (
                                        <p>N/A</p>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Separator className="bg-purple-200 dark:bg-purple-800" />

                                  {/* Order Items */}
                                  <div>
                                    <h3 className="font-semibold mb-4 text-purple-800 dark:text-purple-200 text-lg flex items-center gap-2">
                                      <Package className="h-5 w-5" />
                                      Order Items
                                    </h3>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item, index) => (
                                        <Card
                                          key={index}
                                          className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-700"
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex gap-4">
                                              <div className="relative w-20 h-20">
                                                <Image
                                                  src={item.variant.thumbnail || "/placeholder.svg?height=80&width=80"}
                                                  alt={item.product.name}
                                                  fill
                                                  className="object-cover rounded-lg border-2 border-purple-200 dark:border-purple-800"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <h4 className="font-semibold text-purple-900 dark:text-purple-200">{item.product.name}</h4>
                                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                                                  <p>
                                                    <strong>Color:</strong> {item.variant.color}
                                                  </p>
                                                  <p>
                                                    <strong>Size:</strong> {item.size}
                                                  </p>
                                                  <p>
                                                    <strong>Category:</strong> {item.product.category} -{" "}
                                                    {item.product.subcategory}
                                                  </p>
                                                  <p>
                                                    <strong>Fabric:</strong> {item.product.fabric}
                                                  </p>
                                                  <p>
                                                    <strong>Style:</strong> {item.product.style}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-semibold text-purple-900 dark:text-purple-200">
                                                  ₹{item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                                  Total: ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>

                                  <Separator className="bg-purple-200 dark:bg-purple-800" />

                                  {/* Order Summary */}
                                  <Card className="bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 dark:border-purple-700">
                                    <CardHeader>
                                      <CardTitle className="text-purple-800 dark:text-purple-200 text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Order Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700 dark:text-purple-300">Subtotal:</span>
                                        <span className="font-medium">₹{selectedOrder.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700 dark:text-purple-300">Tax:</span>
                                        <span className="font-medium">₹{selectedOrder.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700 dark:text-purple-300">Shipping:</span>
                                        <span className="font-medium">₹{selectedOrder.shipping.toFixed(2)}</span>
                                      </div>
                                      <Separator className="bg-purple-300 dark:bg-purple-700" />
                                      <div className="flex justify-between font-bold text-lg text-purple-900 dark:text-purple-200">
                                        <span>Total:</span>
                                        <span>₹{selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                            {/* Change Status Dialog */}
                          <Dialog open={statusDialogOpen && selectedOrder?._id === order._id} onOpenChange={(open) => {
                            setStatusDialogOpen(open)
                            if (open) {
                              setSelectedOrder(order)
                              setSelectedStatus(getEffectiveStatus(order))
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setSelectedStatus(getEffectiveStatus(order))
                                  setStatusDialogOpen(true)
                                }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
                              >
                                <Edit3 className="h-4 w-4 mr-1" /> Change Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-purple-800 dark:text-purple-200">Change Order Status - #{order._id.slice(-6)}</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-slate-800">
                                    {["pending", "confirmed", "shipped", "return_request", "returned", "delivered", "cancelled"].map((status) => (
                                      <SelectItem key={status} value={status} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => selectedOrder && handleStatusChange(selectedOrder._id, selectedStatus)}
                                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                >
                                  Update Status
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}

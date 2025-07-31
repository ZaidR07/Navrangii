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
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TabsContent} from "@/components/ui/tabs"
import Image from "next/image"
import { OrdersListTabProps } from "@/lib/types/reactComponentsProps"
import { Order } from "@/lib/types/orderType"
import { useState } from "react"


const getStatusIcon = (status: Order["orderStatusUpdate"]) => {
  const icons = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  }
  const Icon = icons[status.status] || Clock
  return <Icon className="h-4 w-4" />
}

export default function OrdersListTab({getStatusColor,orders}: OrdersListTabProps) {
      const [searchTerm, setSearchTerm] = useState("")
      const [statusFilter, setStatusFilter] = useState<string>("all")
      const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
      const filteredOrders = orders.filter((order) => {
  const name = order.customerName || ""
  const email = order.customerEmail || ""
  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus = statusFilter === "all" || order.orderStatusUpdate?.status === statusFilter

  return matchesSearch && matchesStatus
})

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
                    className="pl-10 bg-white border-white text-slate-800 focus-visible:ring-purple-700 dark:text-black"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="min-w-[9rem] bg-gradient-to-r from-purple-500 to-purple-600 border-white text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-r from-violet-400 to-purple-500 border-white dark:from-slate-900">
                    {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <SelectItem key={status} value={status} className="text-white">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
            <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-200/50">
                    {["Order", "Customer", "Date", "Status", "Distributor", "Total", "Actions"].map(header => (
                      <TableHead key={header} className="text-purple-700 font-semibold">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id} className="border-purple-100/50 hover:bg-purple-50/30">
                      <TableCell>
                        <div className="text-sm text-purple-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-purple-900">{order.customerName}</div>
                        <div className="text-sm text-purple-600">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell className="text-purple-800">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.orderStatusUpdate)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.orderStatusUpdate)}
                            {order.orderStatusUpdate.status.charAt(0).toUpperCase() + order.orderStatusUpdate.status.slice(1)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.assignedDeliveryPartner ? (
                          <div className="text-sm">
                            <div className="font-medium text-purple-900">{order.assignedDeliveryPartner.name}</div>
                            <div className="text-purple-600">{order.assignedDeliveryPartner.city}</div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-purple-900">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
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
                              <DialogTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                                Order Details 
                              </DialogTitle>
                            </DialogHeader>
                             {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Order Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                                      <CardHeader>
                                        <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
                                          <Users className="h-5 w-5" />
                                          Customer Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2 text-sm">
                                        <p>
                                          <strong className="text-purple-700">Name:</strong>{" "}
                                          {selectedOrder.customerName}
                                        </p>
                                        <p>
                                          <strong className="text-purple-700">Email:</strong>{" "}
                                          {selectedOrder.customerEmail}
                                        </p>
                                        <p>
                                          <strong className="text-purple-700">Order Date:</strong>{" "}
                                          {new Date(selectedOrder.orderDate).toLocaleString()}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                                      <CardHeader>
                                        <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                                          <Package className="h-5 w-5" />
                                          Order Status
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <Badge className={getStatusColor(selectedOrder.orderStatusUpdate)}>
                                          <div className="flex items-center gap-1">
                                            {getStatusIcon(selectedOrder.orderStatusUpdate)}
                                            {selectedOrder.orderStatusUpdate.status.charAt(0).toUpperCase() +
                                              selectedOrder.orderStatusUpdate.status.slice(1)}
                                          </div>
                                        </Badge>
                                        <p className="text-sm">
                                          <strong className="text-blue-700">Payment:</strong>{" "}
                                          {selectedOrder.orderStatusUpdate.paymentStatus}
                                        </p>
                                        {selectedOrder.orderStatusUpdate.trackingNumber && (
                                          <p className="text-sm">
                                            <strong className="text-blue-700">Tracking:</strong>{" "}
                                            {selectedOrder.orderStatusUpdate.trackingNumber}
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Distributor Info */}
                                  {selectedOrder.assignedDeliveryPartner && (
                                    <>
                                      <Separator className="bg-purple-200" />
                                      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                                        <CardHeader>
                                          <CardTitle className="text-orange-800 text-lg flex items-center gap-2">
                                            <UserCheck className="h-5 w-5" />
                                            Assigned Distributor
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                          <p>
                                            <strong className="text-orange-700">Name:</strong>{" "}
                                            {selectedOrder.assignedDeliveryPartner.name}
                                          </p>
                                          <p>
                                            <strong className="text-orange-700">Email:</strong>{" "}
                                            {selectedOrder.assignedDeliveryPartner.email}
                                          </p>
                                          <p>
                                            <strong className="text-orange-700">Phone:</strong>{" "}
                                            {selectedOrder.assignedDeliveryPartner.phone}
                                          </p>
                                          <p>
                                            <strong className="text-orange-700">Location:</strong>{" "}
                                            {selectedOrder.assignedDeliveryPartner.city},{" "}
                                            {selectedOrder.assignedDeliveryPartner.state}
                                          </p>
                                          {selectedOrder.assignedDate && (
                                            <p>
                                              <strong className="text-orange-700">Assigned Date:</strong>{" "}
                                              {new Date(selectedOrder.assignedDate).toLocaleString()}
                                            </p>
                                          )}
                                         
                                        </CardContent>
                                      </Card>
                                    </>
                                  )}

                                  <Separator className="bg-purple-200" />

                                  {/* Shipping Address */}
                                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                    <CardHeader>
                                      <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Shipping Address
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
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
                                    </CardContent>
                                  </Card>

                                  <Separator className="bg-purple-200" />

                                  {/* Order Items */}
                                  <div>
                                    <h3 className="font-semibold mb-4 text-purple-800 text-lg flex items-center gap-2">
                                      <Package className="h-5 w-5" />
                                      Order Items
                                    </h3>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item, index) => (
                                        <Card
                                          key={index}
                                          className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200"
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex gap-4">
                                              <div className="relative w-20 h-20">
                                                <Image
                                                  src={item.variant.thumbnail || "/placeholder.svg?height=80&width=80"}
                                                  alt={item.product.name}
                                                  fill
                                                  className="object-cover rounded-lg border-2 border-purple-200"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <h4 className="font-semibold text-purple-900">{item.product.name}</h4>
                                                <div className="text-sm text-slate-600 space-y-1 mt-2">
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
                                                <p className="font-semibold text-purple-900">
                                                  ${item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                                <p className="text-sm text-purple-600 font-medium">
                                                  Total: ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>

                                  <Separator className="bg-purple-200" />

                                  {/* Order Summary */}
                                  <Card className="bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300">
                                    <CardHeader>
                                      <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Order Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700">Subtotal:</span>
                                        <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700">Tax:</span>
                                        <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-purple-700">Shipping:</span>
                                        <span className="font-medium">${selectedOrder.shipping.toFixed(2)}</span>
                                      </div>
                                      <Separator className="bg-purple-300" />
                                      <div className="flex justify-between font-bold text-lg text-purple-900">
                                        <span>Total:</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                          </DialogContent>
                        </Dialog>
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

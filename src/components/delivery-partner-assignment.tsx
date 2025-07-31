"use client"

import {
  Search,
  CheckCircle,
  Clock,
  Users,
  UserCheck,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { mockDeliveryPartners } from "@/lib/constants/ordersData"
import { DeliveryPartnerAssignmentProps } from "@/lib/types/reactComponentsProps"

export default function DeliveryPartnerAssignment({
  orders,
  getStatusColor,
  setOrders,
}: DeliveryPartnerAssignmentProps) {
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<string>("")
  const [deliveryPartnerNotes, setDeliveryPartnerNotes] = useState("")
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("")

  const getCurrentOrdersCount = (deliveryPartnerId: string): number => {
    return orders.filter(
      (order) => order.assignedDeliveryPartner?._id === deliveryPartnerId
    ).length
  }

  const unassignedOrders = orders.filter((order) => {
    const matchesSearch = (order.customerName || "")
      .toLowerCase()
      .includes(assignmentSearchTerm.toLowerCase())
    const isUnassigned =
      !order.assignedDeliveryPartner &&
      (order.orderStatusUpdate?.status === "confirmed" || order.orderStatusUpdate?.status === "processing")
    return matchesSearch && isUnassigned
  })

  const assignedOrders = orders.filter((order) => order.assignedDeliveryPartner)

  const handleAssignDeliveryPartner = (orderId: string) => {
    if (!selectedDeliveryPartner) return

    const deliveryPartner = mockDeliveryPartners.find((d) => d._id === selectedDeliveryPartner)
    if (!deliveryPartner) return

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              assignedDeliveryPartner: deliveryPartner,
              assignedDate: new Date().toISOString(),
              deliveryPartnerNotes,
              status: {
                ...order.orderStatusUpdate,
                status: "processing",
              },
            }
          : order
      )
    )

    setSelectedDeliveryPartner("")
    setDeliveryPartnerNotes("")
  }

  return (
    <TabsContent value="assignment" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unassigned Orders */}
        <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Unassigned Orders ({unassignedOrders.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search unassigned orders..."
                value={assignmentSearchTerm}
                onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                className="pl-10 bg-white border-white text-slate-800 focus-visible:ring-purple-700"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {unassignedOrders.map((order) => (
                <Card key={order._id} className="bg-white border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-purple-600">{order.customerName}</p>
                        <p className="text-sm text-slate-600">
                          {order.shippingAddress?.city ?? "—"}, {order.shippingAddress?.state ?? "—"}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.orderStatusUpdate ?? { status: "pending" })}>
                        {order.orderStatusUpdate?.status
                          ? order.orderStatusUpdate.status.charAt(0).toUpperCase() + order.orderStatusUpdate.status.slice(1)
                          : "Unknown"}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <Select value={selectedDeliveryPartner} onValueChange={setSelectedDeliveryPartner}>
                        <SelectTrigger className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                          <SelectValue placeholder="Select delivery-partner" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDeliveryPartners
                            .filter((d) => d.status === "active")
                            .map((deliveryPartner) => (
                              <SelectItem key={deliveryPartner._id} value={deliveryPartner._id}>
                                <div>
                                  <div className="font-medium">{deliveryPartner.name}</div>
                                  <div className="text-sm text-slate-600">
                                    {deliveryPartner.city} • {getCurrentOrdersCount(deliveryPartner._id)}/{deliveryPartner.capacity} orders
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Add notes for delivery-partner..."
                        value={deliveryPartnerNotes}
                        onChange={(e) => setDeliveryPartnerNotes(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Button
                        onClick={() => handleAssignDeliveryPartner(order._id)}
                        disabled={!selectedDeliveryPartner}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Assign delivery-partner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available delivery-partners */}
        <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Available delivery-partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockDeliveryPartners
                .filter((d) => d.status === "active")
                .map((deliveryPartner) => {
                  const count = getCurrentOrdersCount(deliveryPartner._id)
                  const capacityRatio = count / deliveryPartner.capacity
                  return (
                    <Card key={deliveryPartner._id} className="bg-white border-green-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-green-900">{deliveryPartner.name}</h4>
                            <p className="text-sm text-green-600">{deliveryPartner.email}</p>
                            <p className="text-sm text-slate-600">{deliveryPartner.phone}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              capacityRatio > 0.8
                                ? "border-red-300 text-red-700"
                                : "border-green-300 text-green-700"
                            }
                          >
                            {count}/{deliveryPartner.capacity}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {deliveryPartner.city}, {deliveryPartner.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {deliveryPartner.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {deliveryPartner.phone}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${capacityRatio > 0.8 ? "bg-red-500" : "bg-green-500"}`}
                              style={{ width: `${capacityRatio * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Capacity: {Math.round(capacityRatio * 100)}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Orders Summary */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recently Assigned Orders ({assignedOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-700">Customer</TableHead>
                  <TableHead className="text-blue-700">delivery-partner</TableHead>
                  <TableHead className="text-blue-700">Assigned Date</TableHead>
                  <TableHead className="text-blue-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedOrders.slice(0, 5).map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {order.assignedDeliveryPartner && (
                        <div>
                          <div className="font-medium">{order.assignedDeliveryPartner.name}</div>
                          <div className="text-sm text-slate-600">
                            {order.assignedDeliveryPartner.city}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.assignedDate
                        ? new Date(order.assignedDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.orderStatusUpdate ?? "pending")}>
                        {order.orderStatusUpdate?.status
                          ? order.orderStatusUpdate.status.charAt(0).toUpperCase() + order.orderStatusUpdate.status.slice(1)
                          : "Unknown"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

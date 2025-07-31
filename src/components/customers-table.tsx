"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Mail,
  Phone,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  MapPin,
} from "lucide-react";
import { Separator } from "./ui/separator";
import type { ExtendedUser } from "@/lib/types/userType";
import type { Order } from "@/lib/types/orderType";
import Image from "next/image";
import PageLoading from "./page-loading";

interface CustomersTableProps {
  filteredUsers?: ExtendedUser[];
  getUserLastOrder: (user: ExtendedUser) => Order | undefined;
  getUserOrders: (user: ExtendedUser) => Order[];
  getUserTotalOrders: (user: ExtendedUser) => number;
  getUserTotalSpent: (user: ExtendedUser) => number;
  isDebouncing: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
    case "confirmed":
      return "bg-gradient-to-r from-blue-400 to-blue-500 text-white";
    case "processing":
      return "bg-gradient-to-r from-orange-400 to-orange-500 text-white";
    case "shipped":
      return "bg-gradient-to-r from-purple-400 to-purple-500 text-white";
    case "delivered":
      return "bg-gradient-to-r from-green-400 to-green-500 text-white";
    case "cancelled":
      return "bg-gradient-to-r from-red-400 to-red-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
  }
};

export const CustomersTable: React.FC<CustomersTableProps> = ({
  filteredUsers,
  getUserLastOrder,
  getUserOrders,
  getUserTotalOrders,
  getUserTotalSpent,
  isDebouncing,
}) => {
  if (isDebouncing) {
    return <PageLoading />;
  }
  return (
    <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Customer Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-purple-200/50">
                <TableHead className="text-purple-700 font-semibold">
                  Customer
                </TableHead>
                <TableHead className="text-purple-700 font-semibold">
                  Contact
                </TableHead>
                <TableHead className="text-purple-700 font-semibold">
                  Orders
                </TableHead>
                <TableHead className="text-purple-700 font-semibold">
                  Total Spent
                </TableHead>
                <TableHead className="text-purple-700 font-semibold">
                  Last Order
                </TableHead>
                <TableHead className="text-purple-700 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => {
                const lastOrder = getUserLastOrder(user);
                const totalOrders = getUserTotalOrders(user);
                const totalSpent = getUserTotalSpent(user);
                return (
                  <TableRow
                    key={user._id}
                    className="border-purple-100/50 hover:bg-purple-50/30"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-purple-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-purple-600">
                          Joined{" "}
                          {user.createdAt &&
                            new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-purple-800">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-purple-600">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-purple-800">
                        <Package className="h-4 w-4" />
                        {totalOrders}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-purple-900">
                      ${totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {lastOrder ? (
                        <div>
                          <div className="font-medium text-purple-900">
                            #{lastOrder._id}
                          </div>
                          <div className="text-sm text-purple-600">
                            {new Date(lastOrder.createdAt).toLocaleDateString()}
                          </div>
                          <Badge
                            className={`${getStatusColor(
                              lastOrder.orderStatusUpdate.status
                            )} text-xs mt-1`}
                          >
                            {lastOrder.orderStatusUpdate.status.charAt(0).toUpperCase() +
                              lastOrder.orderStatusUpdate.status.slice(1)}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No orders</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                              Customer Details - {user.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                                <CardHeader>
                                  <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Customer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <strong className="text-purple-700">
                                      Name:
                                    </strong>
                                    <span>{user.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-purple-600" />
                                    <strong className="text-purple-700">
                                      Email:
                                    </strong>
                                    <span>{user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-purple-600" />
                                    <strong className="text-purple-700">
                                      Phone:
                                    </strong>
                                    <span>{user.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    <strong className="text-purple-700">
                                      Joined:
                                    </strong>
                                    <span>
                                      {user.createdAt &&
                                        new Date(
                                          user.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                <CardHeader>
                                  <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Order Statistics
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-green-700">
                                      Total Orders:
                                    </span>
                                    <span className="font-medium">
                                      {totalOrders}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-700">
                                      Total Spent:
                                    </span>
                                    <span className="font-medium">
                                      ${totalSpent.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-700">
                                      Average Order:
                                    </span>
                                    <span className="font-medium">
                                      $
                                      {(totalSpent / totalOrders || 0).toFixed(
                                        2
                                      )}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Separator className="bg-purple-200" />

                            {/* Order History */}
                            <div>
                              <h3 className="font-semibold mb-4 text-purple-800 text-lg flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order History ({getUserOrders(user).length})
                              </h3>
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {getUserOrders(user).map((order) => (
                                  <Card
                                    key={order._id}
                                    className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-3">
                                        <div>
                                          <h4 className="font-semibold text-purple-900">
                                            #{order._id}
                                          </h4>
                                          <p className="text-sm text-purple-600">
                                            {new Date(
                                              order.createdAt
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <Badge
                                            className={getStatusColor(
                                              order.orderStatusUpdate.status
                                            )}
                                          >
                                            {order.orderStatusUpdate.status
                                              .charAt(0)
                                              .toUpperCase() +
                                              order.orderStatusUpdate.status.slice(1)}
                                          </Badge>
                                          <p className="text-sm font-semibold text-purple-900 mt-1">
                                            ${order.total.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-4">
                                        {order.items
                                          .slice(0, 3)
                                          .map((item, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="relative w-12 h-12">
                                                <Image
                                                  src={
                                                    item.variant.thumbnail ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt={item.product.name}
                                                  fill
                                                  className="object-cover rounded border border-purple-200"
                                                />
                                              </div>
                                              <div className="text-xs">
                                                <p className="font-medium text-purple-900 truncate max-w-20">
                                                  {item.product.name}
                                                </p>
                                                <p className="text-purple-600">
                                                  {item.variant.color} •{" "}
                                                  {item.size}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        {order.items.length > 3 && (
                                          <div className="flex items-center text-sm text-purple-600">
                                            +{order.items.length - 3} more
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-3 flex justify-between items-center text-sm">
                                        <span className="text-purple-600">
                                          {order.items.length} item
                                          {order.items.length !== 1 ? "s" : ""}
                                        </span>
                                        <div className="flex items-center gap-2 text-purple-600">
                                          <MapPin className="h-3 w-3" />
                                          {order.shippingAddress.city},{" "}
                                          {order.shippingAddress.state}
                                        </div>
                                      </div>
                                      {order.orderStatusUpdate.trackingNumber && (
                                        <div className="mt-2 text-xs text-purple-600">
                                          <strong>Tracking:</strong>{" "}
                                          {order.orderStatusUpdate.trackingNumber}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                                {getUserOrders(user).length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No orders found for this customer</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

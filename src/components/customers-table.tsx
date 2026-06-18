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
import LoaderSpinner from "./loader-spinner";

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
    return <LoaderSpinner message="Loading customers..." />;
  }
  return (
    <Card className="border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Customer Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold">
                  Customer
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold">
                  Contact
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold">
                  Orders
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold">
                  Total Spent
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold">
                  Last Order
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold">
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
                    className="border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.name || user.email?.split('@')[0] || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {user.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {totalOrders}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      ₹{totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {lastOrder ? (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            #{lastOrder._id}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-slate-400">
                            {(() => {
                            const date = new Date(lastOrder.createdAt);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                          </div>
                          <Badge
                            className={`${getStatusColor(
                              lastOrder.orderStatusUpdate?.status || 'pending'
                            )} text-xs mt-1`}
                          >
                            {(lastOrder.orderStatusUpdate?.status || 'pending').charAt(0).toUpperCase() +
                              (lastOrder.orderStatusUpdate?.status || 'pending').slice(1)}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-slate-400 text-sm">No orders</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-900 text-white border-0 hover:bg-gray-800"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-800">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">
                              Customer Details - {user.name || user.email?.split('@')[0] || 'Unknown'}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border-gray-200 dark:border-slate-700">
                                <CardHeader>
                                  <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Customer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <strong className="text-gray-900 dark:text-white">Name:</strong>
                                    <span>{user.name || user.email?.split('@')[0] || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                                    <strong className="text-gray-900 dark:text-white">Email:</strong>
                                    <span>{user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                                    <strong className="text-gray-900 dark:text-white">Phone:</strong>
                                    <span>{user.phone || 'N/A'}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-gray-200 dark:border-slate-700">
                                <CardHeader>
                                  <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Order Statistics
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-900 dark:text-white">Total Orders:</span>
                                    <span className="font-medium">{totalOrders}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-900 dark:text-white">Total Spent:</span>
                                    <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-900 dark:text-white">Average Order:</span>
                                    <span className="font-medium">₹{(totalSpent / totalOrders || 0).toFixed(2)}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Separator className="bg-gray-200 dark:bg-slate-700" />

                            {/* Order History */}
                            <div>
                              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order History ({getUserOrders(user).length})
                              </h3>
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {getUserOrders(user).map((order) => (
                                  <Card
                                    key={order._id}
                                    className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-700"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-3">
                                        <div>
                                          <h4 className="font-semibold text-gray-900 dark:text-white">
                                            #{order._id}
                                          </h4>
                                          <p className="text-sm text-gray-600 dark:text-slate-400">
                                            {(() => {
                                            const date = new Date(order.createdAt);
                                            const day = date.getDate().toString().padStart(2, '0');
                                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}/${month}/${year}`;
                                          })()}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <Badge
                                            className={getStatusColor(
                                              order.orderStatusUpdate?.status || 'pending'
                                            )}
                                          >
                                            {(order.orderStatusUpdate?.status || 'pending')
                                              .charAt(0)
                                              .toUpperCase() +
                                              (order.orderStatusUpdate?.status || 'pending').slice(1)}
                                          </Badge>
                                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                            ₹{order.total.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                      {(() => {
                                        const items = Array.isArray(order.items) ? order.items : [];

                                        return (
                                          <div className="flex gap-4">
                                            {items.slice(0, 3).map((item, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center gap-2"
                                              >
                                                <div className="relative w-12 h-12">
                                                  <Image
                                                    src={
                                                      item.variant?.thumbnail ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt={item.product?.name || "Product"}
                                                    fill
                                                    className="object-cover rounded border border-gray-200 dark:border-slate-700"
                                                  />
                                                </div>
                                                <div className="text-xs">
                                                  <p className="font-medium text-gray-900 dark:text-white truncate max-w-20">
                                                    {item.product?.name || "-"}
                                                  </p>
                                                  <p className="text-gray-600 dark:text-slate-400">
                                                    {item.variant?.color || "-"} •{" "}
                                                    {item.size || "-"}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                            {items.length > 3 && (
                                              <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                                +{items.length - 3} more
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                      <div className="mt-3 flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-slate-400">
                                          {(Array.isArray(order.items) ? order.items.length : 0)} item
                                          {(Array.isArray(order.items) ? order.items.length : 0) !== 1 ? "s" : ""}
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                                          <MapPin className="h-3 w-3" />
                                          {order.shippingAddress.city},{" "}
                                          {order.shippingAddress.state}
                                        </div>
                                      </div>
                                      {order.orderStatusUpdate?.trackingNumber && (
                                        <div className="mt-2 text-xs text-gray-600 dark:text-slate-400">
                                          <strong>Tracking:</strong>{" "}
                                          {order.orderStatusUpdate.trackingNumber}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                                {getUserOrders(user).length === 0 && (
                                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
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

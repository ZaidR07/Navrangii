"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LogOut, Loader2, Bell, ShoppingCart, UserPlus, Package, CreditCard, CheckCircle, Clock, AlertCircle, Trash2, CheckCheck } from "lucide-react";
import { useLogout } from "@/hooks/admin/useLogout";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";
import { useGetAllUsers } from "@/hooks/users/useGetAllUser";
import { useGetOrders } from "@/hooks/order/useGetOrders";
import { Order } from "@/lib/types/orderType";
import { ExtendedUser } from "@/lib/types/userType";
import { motion, AnimatePresence } from "framer-motion";

type NotificationType = "order" | "user" | "product" | "payment" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

const generateNotifications = (orders: Order[], users: ExtendedUser[]): Notification[] => {
  const notifications: Notification[] = [];

  // Order notifications
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt || order.orderDate);
    const now = new Date();
    const hoursAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60));
    
    if (hoursAgo < 48) {
      notifications.push({
        id: `order-new-${order._id}`,
        type: "order",
        title: "New Order Received",
        message: `Order #${order._id.slice(-6).toUpperCase()} from ${order.customerName || order.userEmail?.split('@')[0] || 'Unknown'} for ₹${order.total.toLocaleString()}`, 
        timestamp: order.createdAt || order.orderDate,
        read: hoursAgo > 24,
        data: order,
      });

      if (order.orderStatusUpdate?.status === "shipped") {
        notifications.push({
          id: `order-shipped-${order._id}`,
          type: "order",
          title: "Order Shipped",
          message: `Order #${order._id.slice(-6).toUpperCase()} has been shipped`,
          timestamp: order.createdAt,
          read: false,
          data: order,
        });
      }
    }
  });

  // User notifications
  users.slice(0, 5).forEach((user) => {
    const userDate = new Date(user.createdAt || Date.now());
    const now = new Date();
    const hoursAgo = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60));
    
    if (hoursAgo < 72) {
      notifications.push({
        id: `user-new-${user._id}`,
        type: "user",
        title: "New Customer",
        message: `${user.name || user.email} just joined`,
        timestamp: user.createdAt || new Date().toISOString(),
        read: hoursAgo > 48,
        data: user,
      });
    }
  });

  return notifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order": return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    case "user": return <UserPlus className="h-4 w-4 text-green-500" />;
    case "product": return <Package className="h-4 w-4 text-orange-500" />;
    case "payment": return <CreditCard className="h-4 w-4 text-purple-500" />;
    case "system": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationBadge = (type: NotificationType) => {
  const styles = {
    order: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    product: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    payment: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    system: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return styles[type] || styles.system;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  // Format: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Header() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: user, isLoading } = useCurrentAdmin();
  const { data: users = [] } = useGetAllUsers();
  const { data: ordersData } = useGetOrders();
  const orders = ordersData?.orders || [];
  const [isOpen, setIsOpen] = useState(false);
  // Generate notifications from data
  const generatedNotifications = useMemo(() => {
    return generateNotifications(orders, users);
  }, [orders, users]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleLogout = () => logout();

  // Sync state with generated notifications on first load
  useEffect(() => {
    if (generatedNotifications.length > 0 && notifications.length === 0) {
      setNotifications(generatedNotifications);
    }
  }, [generatedNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-lg border-b border-purple-200/30 dark:border-purple-700/30 shadow-sm">
      {/* Left Side - Empty */}
      <div className="flex items-center gap-4">
      </div>

      {/* Mobile Centered Welcome */}
      <div className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="text-center">
          <p className="text-xs font-medium bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Welcome
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isLoading ? 'Loading...' : user?.email || 'User'}
          </p>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 ml-auto" ref={dropdownRef}>
        {/* Welcome Text */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            Welcome back,
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {isLoading ? 'Loading...' : user?.email || 'User'}
          </span>
        </div>

        {/* Notifications Popup */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 relative"
            aria-label="Notifications"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Bell className="h-6 w-6 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Dropdown - Right aligned */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-purple-100 dark:border-purple-800 z-[100] overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/20">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="text-xs h-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      All read
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Bell className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.slice(0, 8).map((notification: Notification) => (
                        <div
                          key={notification.id}
                          className={`group flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-purple-50/50 dark:bg-purple-900/10" : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${getNotificationBadge(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-xs truncate ${
                              notification.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-purple-500 hover:text-purple-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-rose-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 8 && (
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      +{notifications.length - 8} more notifications
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
        >
          {isLoggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
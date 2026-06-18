"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bell, ShoppingCart, UserPlus, Package, CreditCard, CheckCircle, Clock, AlertCircle, Trash2, CheckCheck } from "lucide-react";
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

const NOTIFICATIONS_READ_KEY = "navrangii_notifications_read";

const getReadNotificationIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReadNotificationIds = (ids: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(ids));
};

const generateNotifications = (orders: Order[], users: ExtendedUser[]): Notification[] => {
  const notifications: Notification[] = [];

  // Order notifications - show orders from last 7 days
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt || order.orderDate);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo < 7) {
      notifications.push({
        id: `order-new-${order._id}`,
        type: "order",
        title: "New Order Received",
        message: `Order #${order._id.slice(-6).toUpperCase()} from ${order.customerName || order.userEmail?.split('@')[0] || 'Unknown'} for ₹${order.total.toLocaleString()}`, 
        timestamp: order.createdAt || order.orderDate,
        read: false,
        data: order,
      });
    }
  });

  // User notifications - show new users from last 7 days
  users.forEach((user) => {
    const userDate = new Date(user.createdAt || Date.now());
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo < 7) {
      notifications.push({
        id: `user-new-${user._id}`,
        type: "user",
        title: "New Customer",
        message: `${user.name || user.email} just joined`,
        timestamp: user.createdAt || new Date().toISOString(),
        read: false,
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
  const { data: user, isLoading } = useCurrentAdmin();
  const { data: users = [] } = useGetAllUsers();
  const { data: ordersData } = useGetOrders();
  const orders = ordersData?.orders || [];
  const [isOpen, setIsOpen] = useState(false);
  const [notificationVersion, setNotificationVersion] = useState(0);
  // Generate notifications from data
  const generatedNotifications = useMemo(() => {
    return generateNotifications(orders, users);
  }, [orders, users]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  // Merge generated notifications with persisted read state
  const notifications = useMemo(() => {
    const readIds = getReadNotificationIds();
    return generatedNotifications.map((n) => ({
      ...n,
      read: readIds.includes(n.id),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedNotifications, notificationVersion]);

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
    const readIds = getReadNotificationIds();
    if (!readIds.includes(id)) {
      saveReadNotificationIds([...readIds, id]);
      setNotificationVersion((v) => v + 1);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    saveReadNotificationIds(allIds);
    setNotificationVersion((v) => v + 1);
  };

  const deletedIdsRef = React.useRef<Set<string>>(new Set());
  const deleteNotification = (id: string) => {
    deletedIdsRef.current.add(id);
    setNotificationVersion((v) => v + 1);
  };

  return (
    <header className="flex items-center justify-between w-full px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ">
      {/* Left Side - Admin Brand / Page Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-sm">
          <span className="text-sm font-bold">A</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate">
            Admin Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Manage your store
          </p>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
        {/* User Info */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-xs font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-sm text-slate-700 dark:text-slate-200 max-w-[140px] truncate">
            {isLoading ? '...' : user?.email?.split('@')[0] || 'Admin'}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

        {/* Notifications Popup */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 relative h-9 w-9"
            aria-label="Notifications"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Dropdown - Right aligned */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-[10px] font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="text-xs h-7 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.filter((n) => !deletedIdsRef.current.has(n.id)).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                        <Bell className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.filter((n) => !deletedIdsRef.current.has(n.id)).slice(0, 8).map((notification: Notification) => (
                        <div
                          key={notification.id}
                          className={`group flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-slate-50/80 dark:bg-slate-800/30" : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className={`p-1.5 rounded-md shrink-0 ${getNotificationBadge(notification.type)}`}>
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
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-purple-600"
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
                {notifications.filter((n) => !deletedIdsRef.current.has(n.id)).length > 8 && (
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      +{notifications.length - 8} more
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModeToggle />

      </div>
    </header>
  );
}
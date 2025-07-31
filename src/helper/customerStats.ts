// src/lib/utils/customerStats.ts

import type { ExtendedUser } from "@/lib/types/userType";
import type { Order } from "@/lib/types/orderType";

// Get the latest order by createdAt
export const getUserLastOrder = (user: ExtendedUser): Order | undefined => {
  if (!Array.isArray(user.orders)) return undefined;

  const sortedOrders = user.orders
    .filter((order): order is Order =>
      Boolean(order && order.createdAt && order.orderStatusUpdate)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return sortedOrders[0];
};

// Get all valid orders sorted by latest
export const getUserOrders = (user: ExtendedUser): Order[] => {
  if (!Array.isArray(user.orders)) return [];

  return user.orders
    .filter((order): order is Order =>
      Boolean(order && order.createdAt && order.orderStatusUpdate)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUserTotalOrders = (user: ExtendedUser): number => {
  if (!Array.isArray(user.orders)) return 0;
  return user.orders.filter(order => order && order._id).length;
};

export const getUserTotalSpent = (user: ExtendedUser): number => {
  if (!user.orders) return 0;
  return user.orders
    .filter(order => order && typeof order.total === 'number')
    .reduce((sum, order) => sum + order.total, 0);
};

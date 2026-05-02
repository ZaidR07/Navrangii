import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Order } from "@/lib/types/orderType";

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

export const useGetOrders = () => {
  return useQuery<OrdersResponse>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await axios.get("/admin/orders");
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

export const useGetOrdersByEmail = (email: string) => {
  return useQuery<OrdersResponse>({
    queryKey: ["user-orders", email],
    queryFn: async () => {
      if (!email) return { success: true, orders: [] };
      const response = await axios.get(`/admin/orders?email=${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 2,
  });
};

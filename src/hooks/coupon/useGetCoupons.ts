import { Coupon } from "@/lib/types/couponType";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export function useGetCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await apiClient.get(
        `coupon/list`
      );
      if (!response?.data) throw new Error("Failed to fetch coupons");
      return response.data.coupons || [];
    },
  });
}

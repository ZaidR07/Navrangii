import { Coupon } from "@/lib/types/couponType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/list`,
        { withCredentials: true }
      );
      if (!response?.data) throw new Error("Failed to fetch coupons");
      return response.data.data;
    },
  });
}

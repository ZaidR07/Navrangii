import { Coupon, CouponFormData } from "@/lib/types/couponType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

async function updateCoupon({
  id,
  data,
}: {
  id: string;
  data: Partial<CouponFormData>;
}): Promise<Coupon> {
  const response = await apiClient.put(
    `coupon/${id}`,
    data,
    { withCredentials: true }
  );
  if (!response?.data) throw new Error("Failed to update coupon");
  return response.data.data;
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

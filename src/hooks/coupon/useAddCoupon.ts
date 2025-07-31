import { Coupon } from "@/lib/types/couponType";
import { CouponFormData } from "@/validationSchema/couponSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function addCoupon(data: CouponFormData): Promise<Coupon> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/create`,
    data,
    { withCredentials: true }
  );
  if (!response?.data) throw new Error("Failed to add coupon");
  return response.data.data;
}

export function useAddCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCoupon,
    onMutate: async (newCoupon) => {
      await queryClient.cancelQueries({ queryKey: ["coupons"] });

      const previous = queryClient.getQueryData<Coupon[]>(["coupons"]);

      queryClient.setQueryData<Coupon[]>(["coupons"], (old = []) => [
        ...old,
        {
          _id: `temp-${Date.now()}`,
          usedCount: 0,
          createdAt: new Date().toISOString(),
          ...newCoupon,
        },
      ]);

      return { previous };
    },
    onError: (_err, _newCoupon, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["coupons"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

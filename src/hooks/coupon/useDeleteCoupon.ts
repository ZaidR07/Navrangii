import { Coupon } from "@/lib/types/couponType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function deleteCoupon(id: string): Promise<{ success: boolean }> {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/${id}`,
    { withCredentials: true }
  );
  if (!response?.data?.success) throw new Error("Failed to delete coupon");
  return response.data;
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["coupons"] });

      const previous = queryClient.getQueryData(["coupons"]);

      queryClient.setQueryData(["coupons"], (old: Coupon[] = []) =>
        old.filter((c: Coupon) => c._id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["coupons"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

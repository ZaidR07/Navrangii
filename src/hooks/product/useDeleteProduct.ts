import { Product } from "@/lib/types/productType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function deleteProduct(productId: string): Promise<{ message: string }> {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/product/${productId}`,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error(`Failed to delete product`);
  }

  return response.data;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) => {
        if (!old) return [];
        return old.filter((p) => p._id !== productId);
      });

      return { previousProducts };
    },

    onError: (_err, _productId, ctx) => {
      if (ctx?.previousProducts) {
        queryClient.setQueryData(['products'], ctx.previousProducts);
      }
    },

    onSettled: (_data, _err, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}

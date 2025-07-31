// src/hooks/useCreateProduct.ts

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { Product } from "@/lib/types/productType";
import axios from "axios";


async function createProduct(product: Product): Promise<Product> {

  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/product/create`, product, {
    withCredentials: true,
  });
  return response.data.data as Product;
}

// 👇 Accept mutation options here
export function useCreateProduct(
  options?: UseMutationOptions<Product, Error, Product>
) {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Product>({
    mutationFn: createProduct,
    onSuccess: (Product, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      queryClient.setQueryData(["products"], (old: Product[] | undefined) => {
        return old ? [...old, Product] : [Product];
      });

      // 👇 Call user's onSuccess if provided
      options?.onSuccess?.(Product, ...args);
    },
    onError: (error, ...args) => {
      console.error("Create product failed", error);
      // 👇 Call user's onError if provided
      options?.onError?.(error, ...args);
    },
  });
}

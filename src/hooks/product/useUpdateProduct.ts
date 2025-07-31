import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/lib/types/productType';
import axios from 'axios';

// API service function
async function updateProduct(product: Product): Promise<Product> {
  if (!product._id) {
    throw new Error('Product ID is required for update');
  }

  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/product/update`,
    product,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data || !response.data.data) {
    throw new Error(`Failed to update product`);
  }

  return response.data.data;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    async onMutate(updatedProduct: Product) {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) => {
        if (!old) return [updatedProduct];
        return old.map((p) => (p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p));
      });

      queryClient.setQueryData<Product>(['product', updatedProduct._id], (old) =>
        old ? { ...old, ...updatedProduct } : updatedProduct
      );

      return { previousProducts };
    },

    onError(_err, _vars, ctx) {
      if (ctx?.previousProducts) {
        queryClient.setQueryData(['products'], ctx.previousProducts);
      }
    },

    onSuccess(updatedProduct) {
      queryClient.setQueryData<Product>(['product', updatedProduct._id], updatedProduct);
      queryClient.setQueryData<Product[]>(['products'], (old) => {
        if (!old) return [updatedProduct];
        return old.map((p) => (p._id === updatedProduct._id ? updatedProduct : p));
      });
    },

    onSettled(_data, _err, vars) {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', vars._id] });
    },
  });
}

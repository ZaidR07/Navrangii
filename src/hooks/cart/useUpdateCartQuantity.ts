import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface UpdateCartQuantityParams {
  email: string;
  productId: string;
  variantId?: string;
  size: string;
  quantity: number;
}

const updateCartQuantity = async ({ email, productId, variantId, size, quantity }: UpdateCartQuantityParams) => {
  const response = await axios.post(`cart/update-quantity`, { 
    email, 
    productId,
    variantId,
    size,
    quantity
  });
  return response.data;
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.email] });
      queryClient.invalidateQueries({ queryKey: ['cartCount', variables.email] });
    },
    onError: (error) => {
      console.error('Error updating cart quantity:', error);
    },
  });
};

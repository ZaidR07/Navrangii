import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface RemoveFromCartParams {
  email: string;
  productId: string;
  variantId?: string;
  size: string;
}

const removeFromCart = async ({ email, productId, variantId, size }: RemoveFromCartParams) => {
  const response = await axios.post(`cart/remove`, { 
    email, 
    productId,
    variantId,
    size
  });
  return response.data;
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.email] });
      queryClient.invalidateQueries({ queryKey: ['cartCount', variables.email] });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
    },
  });
};

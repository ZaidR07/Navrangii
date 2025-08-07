import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface RemoveFromCartParams {
  email: string;
  productId: string;
  variantId?: string;
  size: string;
}

const removeFromCart = async ({ email, productId, variantId, size }: RemoveFromCartParams) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/cart/remove`, { 
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
    onSuccess: (data) => {
      // Handle success if needed
      console.log('Product removed from cart:', data);
    },
    onError: (error) => {
      // Handle error if needed
      console.error('Error removing from cart:', error);
    },
  });
};

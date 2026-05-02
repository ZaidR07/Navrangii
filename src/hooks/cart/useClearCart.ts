import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

interface ClearCartData {
  email: string;
}

async function clearCart(data: ClearCartData): Promise<void> {
  const response = await apiClient.post('cart/clear', data);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to clear cart');
  }
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.email] });
      queryClient.invalidateQueries({ queryKey: ['cart-count', variables.email] });
    },
  });
}

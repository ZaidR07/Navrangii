import { useMutation } from '@tanstack/react-query';
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
  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: (data) => {
      // Handle success if needed
      console.log('Cart quantity updated:', data);
    },
    onError: (error) => {
      // Handle error if needed
      console.error('Error updating cart quantity:', error);
    },
  });
};

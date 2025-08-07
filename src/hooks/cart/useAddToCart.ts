import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';

interface AddToCartParams {
  productId: string;
  variantId?: string;
  size: string;
  quantity: number;
}

interface AddToCartResponse {
  success: boolean;
  message: string;
}

const addToCart = async (params: AddToCartParams): Promise<AddToCartResponse> => {
  const email = Cookies.get('userEmail');
  if (!email) {
    throw new Error('User not logged in');
  }
  
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/cart/add`, {
    email,
    ...params
  });
  
  return response.data;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AddToCartResponse, Error, AddToCartParams>({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate and refetch cart data
      const email = Cookies.get('userEmail');
      if (email) {
        queryClient.invalidateQueries({ queryKey: ['cart', email] });
      }
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
    }
  });
};

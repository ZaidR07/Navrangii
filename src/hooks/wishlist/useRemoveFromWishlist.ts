import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
interface RemoveFromWishlistParams {
  email: string;
  productId: string;
}

const removeFromWishlist = async ({ email, productId }: RemoveFromWishlistParams) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/wishlist/remove`, { email, productId });
  return response.data;
};

export const useRemoveFromWishlist = () => {
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: (data) => {
      // Handle success if needed
      console.log('Product removed from wishlist:', data);
    },
    onError: (error) => {
      // Handle error if needed
      console.error('Error removing from wishlist:', error);
    },
  });
};

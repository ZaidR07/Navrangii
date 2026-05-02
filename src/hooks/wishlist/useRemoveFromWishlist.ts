import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
interface RemoveFromWishlistParams {
  email: string;
  productId: string;
}

const removeFromWishlist = async ({ email, productId }: RemoveFromWishlistParams) => {
  const response = await axios.post(`wishlist/remove`, { email, productId });
  return response.data;
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.email] });
      queryClient.invalidateQueries({ queryKey: ['wishlistCount', variables.email] });
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
    },
  });
};

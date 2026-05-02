import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
interface AddToWishlistParams {
  email: string;
  productId: string;
}

const addToWishlist = async ({ email, productId }: AddToWishlistParams) => {
  const response = await axios.post(`wishlist/add`, { email, productId });
  return response.data;
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.email] });
      queryClient.invalidateQueries({ queryKey: ['wishlistCount', variables.email] });
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
    },
  });
};

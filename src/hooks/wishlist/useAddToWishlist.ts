import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
interface AddToWishlistParams {
  email: string;
  productId: string;
}

const addToWishlist = async ({ email, productId }: AddToWishlistParams) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/wishlist/add`, { email, productId });
  return response.data;
};

export const useAddToWishlist = () => {
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      // Handle success if needed
      console.log('Product added to wishlist:', data);
    },
    onError: (error) => {
      // Handle error if needed
      console.error('Error adding to wishlist:', error);
    },
  });
};

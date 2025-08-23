import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface WishlistCountData {
  count: number;
}

const fetchWishlistCount = async (email: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/wishlist/count/${email}`);
  return response.data;
};

export const useWishlistCount = (email: string) => {
  return useQuery<WishlistCountData>({
    queryKey: ['wishlistCount', email],
    queryFn: () => fetchWishlistCount(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

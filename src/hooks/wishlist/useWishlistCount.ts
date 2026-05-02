import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface WishlistCountData {
  count: number;
}

interface WishlistData {
  email: string;
  wishlist: Array<{ productId: string }>;
}

const fetchWishlistCount = async (email: string) => {
  const response = await axios.get<WishlistData>(`wishlist/${email}`);
  return { count: response.data?.wishlist?.length || 0 };
};

export const useWishlistCount = (email: string) => {
  return useQuery<WishlistCountData>({
    queryKey: ['wishlistCount', email],
    queryFn: () => fetchWishlistCount(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

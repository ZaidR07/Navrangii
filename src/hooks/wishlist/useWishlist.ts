import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
interface WishlistItem {
  productId: string;
  addedAt: string;
}

interface WishlistData {
  email: string;
  wishlist: WishlistItem[];
}

const fetchWishlist = async (email: string) => {
  const response = await axios.get(`wishlist/${email}`);
  return response.data;
};

export const useWishlist = (email: string) => {
  return useQuery<WishlistData>({
    queryKey: ['wishlist', email],
    queryFn: () => fetchWishlist(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface CartCountData {
  count: number;
}

const fetchCartCount = async (email: string) => {
  const response = await axios.get(`cart/count/${email}`);
  return response.data;
};

export const useCartCount = (email: string) => {
  return useQuery<CartCountData>({
    queryKey: ['cartCount', email],
    queryFn: () => fetchCartCount(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

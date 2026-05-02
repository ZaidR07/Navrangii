import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface CartCountData {
  count: number;
}

interface CartData {
  email: string;
  cart: Array<{ quantity?: number }>;
}

const fetchCartCount = async (email: string) => {
  const response = await axios.get<CartData>(`cart/${email}`);
  const cart = response.data?.cart || [];
  const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  return { count };
};

export const useCartCount = (email: string) => {
  return useQuery<CartCountData>({
    queryKey: ['cartCount', email],
    queryFn: () => fetchCartCount(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

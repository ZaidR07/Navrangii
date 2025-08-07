import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Product } from '@/lib/types/productType';

export interface CartItem {
  productId: string;
  variantId?: string;
  size: string;
  quantity: number;
  addedAt?: string;
  product: Product;
  variant: any; // Variant data from backend
}

interface CartData {
  email: string;
  cart: CartItem[];
}

const fetchCart = async (email: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/cart/${email}`);
  return response.data;
};

export const useCart = (email: string) => {
  return useQuery<CartData>({
    queryKey: ['cart', email],
    queryFn: () => fetchCart(email),
    enabled: !!email, // Only fetch if email is provided
  });
};

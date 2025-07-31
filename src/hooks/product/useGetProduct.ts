import { useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/types/productType';
import axios from 'axios';

// API service function
async function fetchAllProducts(): Promise<Product[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/product/all`, {
    
    withCredentials: true,
  });

  if (!response || !response.data || !response.data.data) {
    throw new Error("Failed to fetch products");
  }

  return response.data.data;
}

// React Query hook
export function useGetAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

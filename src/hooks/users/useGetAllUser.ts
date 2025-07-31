import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExtendedUser } from '@/lib/types/userType';

// API service function
async function fetchAllUser(): Promise<ExtendedUser[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/admin/allUser`, {
    
    withCredentials: true,
  });

  if (!response || !response.data || !response.data.data) {
    throw new Error("Failed to fetch products");
  }
  return response.data.data;
}

// React Query hook
export function useGetAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUser,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ExtendedUser } from '@/lib/types/userType';

// API service function
async function fetchAllUser(): Promise<ExtendedUser[]> {
  const response = await apiClient.get(`admin/allUser`, {
    
    withCredentials: true,
  });

  if (!response || !response.data || !response.data.users) {
    throw new Error("Failed to fetch users");
  }
  return response.data.users;
}

// React Query hook
export function useGetAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUser,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

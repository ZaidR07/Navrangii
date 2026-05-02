import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

interface Visitor {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

async function fetchVisitors(): Promise<Visitor[]> {
  const response = await apiClient.get('admin/visitors');

  if (!response || !response.data || !response.data.data) {
    throw new Error("Failed to fetch visitors");
  }
  return response.data.data;
}

export function useGetVisitors() {
  return useQuery({
    queryKey: ['visitors'],
    queryFn: fetchVisitors,
    staleTime: 5 * 60 * 1000,
  });
}

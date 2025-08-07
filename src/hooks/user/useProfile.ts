import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

interface Address {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  addresses?: Address[];
  email: string; // Email is required for identification
}

export const useGetProfile = (email?: string) => {
  // If no email provided, try to get it from cookie
  const emailFromCookie = email || Cookies.get('userEmail') || '';
  
  return useQuery<UserProfile, Error>({
    queryKey: ['profile', emailFromCookie],
    queryFn: async () => {
      if (!emailFromCookie) {
        throw new Error('No email provided for profile fetch');
      }
      const response = await apiClient.get(`/user/profile?email=${encodeURIComponent(emailFromCookie)}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!emailFromCookie, // Only run query if email is available
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      const response = await apiClient.put('/user/profile', profileData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch profile data for this specific user
      queryClient.invalidateQueries({ queryKey: ['profile', variables.email] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    }
  });
};

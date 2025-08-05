import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await apiClient.post('/user/send-otp', { email });
      return response.data;
    },
    onError: (error) => {
      console.error('Error sending OTP:', error);
    }
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await apiClient.post('/user/verify-otp', { email, otp });
      return response.data;
    },
    onSuccess: (data) => {
      // Store user email in cookie for 1 year (365 days)
      Cookies.set('userEmail', data.user.email, { 
        expires: 365, 
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Invalidate and refetch queries that depend on user authentication
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Error verifying OTP:', error);
    }
  });
};

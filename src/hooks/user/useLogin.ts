import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await apiClient.post('/user/send-otp', { phone });
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
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const response = await apiClient.post('/user/verify-otp', { phone, otp });
      return response.data;
    },
    onSuccess: (data) => {
      // Store user phone in cookie for 1 year (365 days)
      Cookies.set('userPhone', data.user.phone, {
        expires: 365,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });

      // Backward compatibility: also set userEmail cookie with the phone
      // so existing cart/wishlist/checkout code keeps working until migrated
      Cookies.set('userEmail', data.user.phone, {
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

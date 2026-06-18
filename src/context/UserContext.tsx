
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSendOtp, useVerifyOtp } from '@/hooks/user/useLogin';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mutateAsync: sendOtpMutation } = useSendOtp();
  const { mutateAsync: verifyOtpMutation } = useVerifyOtp();
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);
  
  const sendOtp = async (email: string): Promise<boolean> => {
    try {
      const response = await sendOtpMutation(email as any);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send OTP');
      }
      
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
    }
  };
  
  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await verifyOtpMutation({ email, otp });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to verify OTP');
      }
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to verify OTP');
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Cookies.remove('userEmail');
  };
  
  const isAuthenticated = !!user || !!Cookies.get('userEmail');
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated,
        isLoading,
        login,
        logout,
        sendOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import { AdminLoginInput } from "@/validationSchema/loginSchema";

const login = async (values: AdminLoginInput): Promise<string> => {
  const { data } = await apiClient.post<{
    message: string;
  }>(`admin/login`, values, {
    withCredentials: true,
    timeout: 10_000,
  });
 
  return data.message;
};

export function useLogin() {
  return useMutation<string, AxiosError<{ message: string }>, AdminLoginInput>({
    mutationFn: login,
    retry: (failureCount, error) => {
      const status = error.response?.status;
      if (status === 404 || status === 401) return false;
      return failureCount < 1;
    },
  });
}

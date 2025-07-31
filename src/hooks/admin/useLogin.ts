import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AdminLoginInput } from "@/validationSchema/loginSchema";

const login = async (values: AdminLoginInput): Promise<string> => {
  const { data } = await axios.post<{
    message: string;
  }>(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/admin/login`, values, {
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

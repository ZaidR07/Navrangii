import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const logout = async (): Promise<string> => {
  const { data } = await apiClient.post<{ message: string }>(
    `admin/logout`,
    {}, // no body needed
    {
      withCredentials: true,
      timeout: 10_000,
    }
  );

  return data.message;
};

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<string, AxiosError<{ message: string }>, void>({
    mutationFn: logout,
    onSuccess: () => {
      // optional: clear accessToken if stored in localStorage
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["currentAdmin"] });
      router.push("/admin");
    },
  });
}

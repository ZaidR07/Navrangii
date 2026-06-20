import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

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
  const { setTheme } = useTheme();

  return useMutation<string, AxiosError<{ message: string }>, void>({
    mutationFn: logout,
    onSuccess: () => {
      // optional: clear accessToken if stored in localStorage
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["currentAdmin"] });
      setTheme("system"); // Reset theme so it doesn't persist after logout
      router.push("/admin");
    },
  });
}

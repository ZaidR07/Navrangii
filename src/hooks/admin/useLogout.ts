import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const logout = async (): Promise<string> => {
  const { data } = await axios.post<{ message: string }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/admin/logout`,
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

  return useMutation<string, AxiosError<{ message: string }>, void>({
    mutationFn: logout,
    onSuccess: () => {
      // optional: clear accessToken if stored in localStorage
      localStorage.removeItem("accessToken");
      router.push("/");
    },
  });
}

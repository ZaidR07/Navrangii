import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Variables } from "@/lib/types/variablesType";
import { AxiosError } from "axios";

export function useGetVariable() {
  return useQuery<Variables>({
    queryKey: ["variables"],
    queryFn: async () => {
      try {
        const res = await apiClient.get('variables/listofvariables', {
          withCredentials: true,
        });
        return res.data.data as Variables;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // Variables not found in DB yet — return empty default
          return {} as Variables;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

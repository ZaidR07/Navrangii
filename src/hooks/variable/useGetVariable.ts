import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Variables } from "@/lib/types/variablesType";

export function useGetVariable() {
  return useQuery<Variables>({
    queryKey: ["variables"],
    queryFn: async () => {

      const res = await apiClient.get('variables/listofvariables', {
        withCredentials: true,
      });

      return res.data.data as Variables;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

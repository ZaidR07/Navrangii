
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Admin } from "@/lib/types/adminType";

export function useCurrentAdmin() {
  return useQuery<Admin>({
    queryKey: ["currentAdmin"],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/me`,{
          withCredentials: true, // 
        }); 
      // The backend returns { message, userWithoutPassword }, so we need to extract userWithoutPassword
      return res.data.userWithoutPassword;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Only retry once and stop on 401/403 errors
      if (failureCount >= 1) return false;
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 403) return false;
      return true;
    },
    retryDelay: 1000, // 1 second delay between retries
  });
}

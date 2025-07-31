
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Admin } from "@/lib/types/adminType";

export function useCurrentAdmin() {
  return useQuery<Admin>({
    queryKey: ["currentAdmin"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/admin/me`,{
          withCredentials: true, // 
        }); 
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EarningsDatum } from "@/lib/types/pieDiagramsType";

// API call
const fetchStats = async (): Promise<EarningsDatum[]> => {
  const response = await axios.get("/api/admin/dashboard/earnings");
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch earnings");
  }
  return response.data.data;
};

// Hook
export function useGetEarningData() {
  return useQuery<EarningsDatum[], Error>({
    queryKey: ["earning"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  });
}

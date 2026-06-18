import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StatCardDatum, StatCardKey } from "@/lib/types/pieDiagramsType";

// API call
const fetchStats = async (): Promise<Record<StatCardKey, StatCardDatum>> => {
  const response = await axios.get("/api/admin/dashboard/stats");
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch stats");
  }
  return response.data.stats;
};

// Hook
export function useGetStatsData() {
  return useQuery<Record<StatCardKey, StatCardDatum>, Error>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  });
}

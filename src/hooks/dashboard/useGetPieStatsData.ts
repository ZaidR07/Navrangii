import { PieDatum, StatusKey } from "@/lib/types/pieDiagramsType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API call
const fetchStats = async (): Promise<Record<StatusKey, PieDatum[]>> => {
  const response = await axios.get("/api/admin/dashboard/pie-stats");
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch pie stats");
  }
  return response.data.stats;
};

// Hook
export function useGetPieStatsData() {
  return useQuery<Record<StatusKey, PieDatum[]>, Error>({
    queryKey: ["pieStats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  });
}

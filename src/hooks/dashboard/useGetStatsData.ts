import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { StatCardDatum, StatCardKey } from "@/lib/types/pieDiagramsType";
import { statsCardData } from "@/lib/constants/pieDiagramsData";


// API call
const fetchStats = async (): Promise<Record<StatCardKey, StatCardDatum>> => {
  //   const response = await axios.post('/api/get-products'); // If your API expects POST
  //   if (!response.data?.product) {
  //     throw new Error('No products found');
  //   }
  //   return response.data.product;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return statsCardData;
};

// Hook
export function useGetStatsData() {
  return useQuery<Record<StatCardKey, StatCardDatum>, Error>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // optional: cache for 5 min
  });
}

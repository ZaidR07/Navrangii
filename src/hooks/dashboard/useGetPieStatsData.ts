import { statusData } from "@/lib/constants/pieDiagramsData";
import { PieDatum, StatusKey } from "@/lib/types/pieDiagramsType";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";


// API call
const fetchStats = async (): Promise<Record<StatusKey, PieDatum[]>> => {
  //   const response = await axios.post('/api/get-products'); // If your API expects POST
  //   if (!response.data?.product) {
  //     throw new Error('No products found');
  //   }
  //   return response.data.product;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return statusData;
};

// Hook
export function useGetPieStatsData() {
  return useQuery<Record<StatusKey, PieDatum[]>, Error>({
    queryKey: ["pieStats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // optional: cache for 5 min
  });
}

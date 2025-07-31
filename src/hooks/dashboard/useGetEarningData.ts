import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { EarningsDatum } from "@/lib/types/pieDiagramsType";
import { yearlyEarnings } from "@/lib/constants/pieDiagramsData";

// API call
const fetchStats = async (): Promise<EarningsDatum[]> => {
  //   const response = await axios.post('/api/get-products'); // If your API expects POST
  //   if (!response.data?.product) {
  //     throw new Error('No products found');
  //   }
  //   return response.data.product;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return yearlyEarnings;
};

// Hook
export function useGetEarningData() {
  return useQuery< EarningsDatum[], Error>({
    queryKey: ["earning"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // optional: cache for 5 min
  });
}

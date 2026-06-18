import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TopProduct {
  name: string;
  totalSell: number;
  unitPrice: number;
  totalAmount: number;
  image: string;
}

// API call
const fetchTopProducts = async (): Promise<TopProduct[]> => {
  const response = await axios.get("/api/admin/dashboard/top-products");
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch top products");
  }
  return response.data.products;
};

// Hook
export function useGetTopProducts() {
  return useQuery<TopProduct[], Error>({
    queryKey: ["topProducts"],
    queryFn: fetchTopProducts,
    staleTime: 1000 * 60 * 5,
  });
}

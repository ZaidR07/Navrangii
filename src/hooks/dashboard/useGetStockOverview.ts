import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface StockProduct {
  _id: string;
  name: string;
  thumbnail: string;
  totalStock: number;
}

export interface StockOverview {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  lowStockProducts: StockProduct[];
}

// API call
const fetchStock = async (): Promise<StockOverview> => {
  const response = await axios.get("/api/admin/dashboard/stock");
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch stock");
  }
  return response.data.stock;
};

// Hook
export function useGetStockOverview() {
  return useQuery<StockOverview, Error>({
    queryKey: ["stockOverview"],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 5,
  });
}

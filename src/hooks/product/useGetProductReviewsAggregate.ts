import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ProductReviewAggregate {
  avgRating: number;
  reviewCount: number;
}

const fetchAggregate = async (productIds: string[]): Promise<Record<string, ProductReviewAggregate>> => {
  const response = await axios.get(`/api/product-reviews/aggregate?productIds=${productIds.join(",")}`);
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch review aggregates");
  }
  return response.data.reviews;
};

export function useGetProductReviewsAggregate(productIds: string[]) {
  return useQuery<Record<string, ProductReviewAggregate>, Error>({
    queryKey: ["productReviewsAggregate", productIds],
    queryFn: () => fetchAggregate(productIds),
    enabled: productIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeliveryPartners } from "@/lib/types/orderType"; // adjust path as needed

// Fetch function to get all delivery partners
async function fetchDeliveryPartner(): Promise<DeliveryPartners[]> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/deliveryPartners/list`,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error("Failed to fetch Delivery Partner");
  }

  return response.data.data as DeliveryPartners[];
}

// Custom hook to use in components
// This hook will fetch the delivery partners and return the data, loading state, and error
export function useGetDeliveryPartners() {
  return useQuery<DeliveryPartners[], Error>({
    queryKey: ["deliverypartners"],
    queryFn: fetchDeliveryPartner,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Retry once on error
  });
}

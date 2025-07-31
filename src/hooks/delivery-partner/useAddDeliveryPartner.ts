import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DeliveryPartners } from "@/lib/types/orderType"; // adjust the path if needed

// Mutation function to create a new delivery partner
async function addDeliveryPartner(deliveryPartners: Omit<DeliveryPartners, "_id">): Promise<DeliveryPartners> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/deliveryPartners/create`,
    deliveryPartners,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error("Failed to add delivery partner");
  }

  return response.data;
}

// Custom hook to use in components
// This hook will handle the mutation and optimistic updates
export function useAddDeliveryPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDeliveryPartner,

    // Optimistic update
    onMutate: async (newDeliveryPartner) => {
      await queryClient.cancelQueries({ queryKey: ["deliverypartners"] });

      const previousDeliveryPartners = queryClient.getQueryData<DeliveryPartners[]>(["deliverypartners"]);

      queryClient.setQueryData<DeliveryPartners[]>(["deliverypartners"], (old = []) => [
        ...old,
        { _id: `temp-${Date.now()}`, ...newDeliveryPartner },
      ]);

      return { previousDeliveryPartners };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousDeliveryPartners) {
        queryClient.setQueryData(["deliverypartners"], context.previousDeliveryPartners);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverypartners"] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverypartners"] });
    },
  });
}

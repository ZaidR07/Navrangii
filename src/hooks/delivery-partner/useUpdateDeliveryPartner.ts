import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { DeliveryPartnerFormData } from "@/validationSchema/deliveryPartnerSchema"

interface UpdatePayload extends DeliveryPartnerFormData{
  id: string
}

async function updateDeliveryPartnerRequest({ id, ...data }: UpdatePayload) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/deliveryPartners/${id}`,
    data,
    {
      withCredentials: true,
    }
  )

  if (!response || !response.data) {
    throw new Error("Failed to update delivery-partner")
  }

  return response.data.data
}

export function useUpdateDeliveryPartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDeliveryPartnerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverypartners"] })
    },
  })
}

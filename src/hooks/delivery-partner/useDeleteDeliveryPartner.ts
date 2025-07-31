    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import axios from "axios";

    export async function deleteDeliveryPartner(DeliveryPartnerId: string): Promise<void> {
    const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/deliveryPartners/${DeliveryPartnerId}`,
        { withCredentials: true }
    );

    if (!response || response.status !== 200) {
        throw new Error("Failed to delete Delivery Partner");
    }
    }

    // Custom mutation hook
    export function useDeleteDeliveryPartner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDeliveryPartner,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["deliverypartners"] });
        },
        onError: (error) => {
        console.error("Delete error:", error);
        },
    });
    }

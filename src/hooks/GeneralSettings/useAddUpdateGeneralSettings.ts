import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface NewsOfferItem {
  id: string;
  title: string;
  description: string;
  type: "news" | "offer";
  isActive: boolean;
}

interface GeneralSettings {
  newsAndOffers: NewsOfferItem[];
  returnPeriod: number | null;
  freeShippingThreshold: number | null;
  phoneNumber: string;
  email: string;
  whatsapp: string;
}

interface SettingsResponse {
  success: boolean;
  message: string;
  data: GeneralSettings;
}

async function updateGeneralSettingsRequest(data: GeneralSettings) {
  const response = await axios.post<SettingsResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/general-settings/add-update-general-settings`,
    data,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error("Failed to update general settings");
  }

  return response.data;
}

export function useAddUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateGeneralSettingsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generalSettings"] });
    },
  });

  const saveGeneralSettings = (settings: GeneralSettings) => {
    return updateMutation.mutate(settings);
  };

  return {
    saveGeneralSettings,
    isSaving: updateMutation.isPending,
    saveError: updateMutation.error,
  };
}

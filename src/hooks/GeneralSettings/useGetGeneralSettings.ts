import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NewsOfferItem {
  id: string;
  title: string;
  description: string;
  type: 'news' | 'offer';
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

// Stable default to avoid new object creation per render
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  newsAndOffers: [],
  returnPeriod: null,
  freeShippingThreshold: null,
  phoneNumber: '',
  email: '',
  whatsapp: '',
};

async function getGeneralSettingsRequest() {
  const response = await axios.get<SettingsResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/general-settings/getgeneral-settings`,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error("Failed to fetch general settings");
  }

  return response.data.data;
}

export function useGetGeneralSettings() {
  const {
    data: settings = DEFAULT_GENERAL_SETTINGS,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["generalSettings"],
    queryFn: getGeneralSettingsRequest,
  });

  return {
    settings,
    isLoading,
    error,
  };
}

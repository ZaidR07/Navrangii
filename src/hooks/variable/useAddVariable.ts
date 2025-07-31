import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Variables } from "@/lib/types/variablesType";

async function updateVariables(variables: Variables): Promise<Variables> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/variables/update`,
    variables,
    {
      withCredentials: true,
    }
  );

  if (!response || !response.data) {
    throw new Error("Failed to update variables");
  }

  return response.data;
}

export function useAddVariables() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVariables,

    onMutate: async (newData: Variables) => {
      await queryClient.cancelQueries({ queryKey: ["variables"] });

      const previousData = queryClient.getQueryData<Variables>(["variables"]);

      queryClient.setQueryData<Variables>(["variables"], (old) => ({
        ...(old ?? {}),
        ...newData,
      }));

      return { previousData };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["variables"], context.previousData);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variables"] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variables"] });
    },
  });
}

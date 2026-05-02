import { useMutation } from "@tanstack/react-query"
import apiClient from "@/lib/axios"

export function useDeleteVariableOption() {
  return useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      const res = await apiClient.delete(
        `variables/remove-variable-option`,
        {
          data: { field, value },
          withCredentials: true,
        }
      )
      return res.data.data
    },
  })
}
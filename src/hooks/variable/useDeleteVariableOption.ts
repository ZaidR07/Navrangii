import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useDeleteVariableOption() {
  return useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/variables/remove-variable-option`,
        {
          data: { field, value },
          withCredentials: true,
        }
      )
      return res.data.data
    },
  })
}
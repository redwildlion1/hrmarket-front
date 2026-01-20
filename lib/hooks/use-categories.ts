import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export const useClusters = () => {
  return useQuery({
    queryKey: ["clusters"],
    queryFn: () => apiClient.categories.getClusters(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useUniversalQuestions = () => {
  return useQuery({
    queryKey: ["universal-questions"],
    queryFn: () => apiClient.universalQuestions.getAll(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

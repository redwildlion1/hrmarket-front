import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => apiClient.location.getCountries(),
    staleTime: Infinity, // Countries rarely change
  })
}

export const useCounties = (countryId: string) => {
  return useQuery({
    queryKey: ["counties", countryId],
    queryFn: () => apiClient.location.getCounties(countryId),
    enabled: !!countryId,
    staleTime: Infinity,
  })
}

export const useCities = (countyId: string) => {
  return useQuery({
    queryKey: ["cities", countyId],
    queryFn: () => apiClient.location.getCities(countyId),
    enabled: !!countyId,
    staleTime: Infinity,
  })
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { firmsApi } from "@/lib/api/firms"

export const useSearchFirms = (params: any) => {
  return useQuery({
    queryKey: ["firms", "search", params],
    queryFn: () => firmsApi.search(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useFirmDetails = (id: string) => {
  return useQuery({
    queryKey: ["firm", id],
    queryFn: () => firmsApi.getById(id),
    enabled: !!id,
  })
}

export const useMyFirm = () => {
  return useQuery({
    queryKey: ["firm", "my"],
    queryFn: () => apiClient.firm.getMyFirm(),
  })
}

export const useUpdateFirmMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, file }: { type: "logo" | "banner"; file: File }) => {
      const backendType = type === "logo" ? "Logo" : "Banner"
      return apiClient.firms.uploadMedia(file, backendType)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
    },
  })
}

export const useCreateFirm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.firm.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
    },
  })
}

export const useFirmTypes = () => {
  return useQuery({
    queryKey: ["firm-types"],
    queryFn: () => apiClient.config.getFirmTypes(),
    staleTime: Infinity,
  })
}

export const useUniversalQuestions = () => {
    return useQuery({
        queryKey: ["universal-questions"],
        queryFn: () => apiClient.universalQuestions.getAll(),
        staleTime: Infinity,
    })
}

export const useFirmReviews = (params: { firmId: string; pageNumber?: number; pageSize?: number; sortingOption?: number; currentPersonId?: string }) => {
    return useQuery({
        queryKey: ["firm-reviews", params],
        queryFn: () => apiClient.firms.reviews.get(params),
        enabled: !!params.firmId,
    })
}

export const useCreateReview = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ firmId, data }: { firmId: string; data: { rating: number; comment: string } }) =>
            apiClient.firms.reviews.create(firmId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["firm-reviews", { firmId: variables.firmId }] })
        },
    })
}

export const useUpdateReview = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ firmId, data }: { firmId: string; data: { rating: number; comment: string } }) =>
            apiClient.firms.reviews.update(firmId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["firm-reviews", { firmId: variables.firmId }] })
        },
    })
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ firmId }: { firmId: string }) => apiClient.firms.reviews.delete(firmId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["firm-reviews", { firmId: variables.firmId }] })
        },
    })
}

export const useUpdateFirmLocation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { address?: string; countryId: string; countyId: string; cityId: string; postalCode?: string }) =>
            apiClient.firm.updateLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useUpdateFirmContact = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { phone?: string; email?: string }) =>
            apiClient.firm.updateContact(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useUpdateFirmLinks = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { website?: string; linkedIn?: string; facebook?: string; twitter?: string; instagram?: string }) =>
            apiClient.firm.updateLinks(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useUpdateFirmDescription = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { description: string }) =>
            apiClient.firm.updateDescription(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useUpdateFirmType = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { type: string }) =>
            apiClient.firm.updateType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useSubmitFirmForVerification = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => firmsApi.submitForReview(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

export const useUpdateUniversalAnswers = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { answers: { universalQuestionId: string; selectedOptionId: string }[] }) =>
            firmsApi.updateUniversalAnswers(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["firm", "my"] })
        },
    })
}

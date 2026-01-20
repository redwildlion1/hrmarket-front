import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export const useSearchJobs = (params: any) => {
  return useQuery({
    queryKey: ["jobs", "search", params],
    queryFn: () => apiClient.jobs.search(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useJobPost = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => apiClient.jobs.getById(id),
    enabled: !!id,
  })
}

export const useFirmJobs = (firmId: string) => {
  return useQuery({
    queryKey: ["jobs", "firm", firmId],
    queryFn: () => apiClient.jobs.getByFirm(firmId),
    enabled: !!firmId,
  })
}

export const useApplyJob = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.jobs.apply(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job", variables] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

export const useUpdateJobPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.jobs.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["job", data.id] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job", "management", data.id] })
    },
  })
}

export const useCreateJobPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.jobs.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

export const useJobPostForManagement = (id: string) => {
  return useQuery({
    queryKey: ["job", "management", id],
    queryFn: () => apiClient.jobs.getForManagement(id),
    enabled: !!id,
  })
}

export const useExpiredJobPostsForManagement = (params: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["jobs", "management", "expired", params],
    queryFn: () => apiClient.jobs.getExpiredForManagement(params),
  })
}

export const useDeletedJobPostsForManagement = (params: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["jobs", "management", "deleted", params],
    queryFn: () => apiClient.jobs.getDeletedForManagement(params),
  })
}

export const useAllJobPostsForManagement = (params: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["jobs", "management", "all", params],
    queryFn: () => apiClient.jobs.getAllForManagement(params),
  })
}

export const useDeleteJobPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.jobs.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "management"] })
    },
  })
}

export const useReactivateExpiredJobPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.jobs.reactivateExpired(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "management"] })
      queryClient.invalidateQueries({ queryKey: ["job", "management"] })
    },
  })
}

export const useReactivateDeletedJobPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.jobs.reactivateDeleted(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "management"] })
      queryClient.invalidateQueries({ queryKey: ["job", "management"] })
    },
  })
}

export const useJobApplications = (jobPostId: string) => {
  return useQuery({
    queryKey: ["job", "applications", jobPostId],
    queryFn: () => apiClient.jobs.getApplications(jobPostId),
    enabled: !!jobPostId,
  })
}

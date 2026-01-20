import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.person.getProfile(),
  })
}

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updateBasicInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateLocation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updateLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateSummary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { summary: string }) => apiClient.person.updateProfessionalSummary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateSkills = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skills: string[]) => apiClient.person.updateSkills(skills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateLanguages = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (languages: string[]) => apiClient.person.updateLanguages(languages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useAddWorkExperience = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.addWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updateWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.person.deleteWorkExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useAddEducation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateEducation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updateEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useDeleteEducation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.person.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useAddCertification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.addCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateCertification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => apiClient.person.updateCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useDeleteCertification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.person.deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUploadCv = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => apiClient.person.uploadCv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => apiClient.person.uploadMedia(file, "Avatar"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

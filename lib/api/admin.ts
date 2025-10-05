import { apiClient } from "./client"
import type {
  Cluster,
  Category,
  Service,
  FirmVerification,
  CreateClusterRequest,
  CreateCategoryRequest,
  CreateServiceRequest,
  VerifyFirmRequest,
} from "@/lib/types/admin"

// Clusters
export const adminApi = {
  // GET methods
  getClusters: () => apiClient.get<Cluster[]>("/admin/clusters"),

  getCategories: () => apiClient.get<Category[]>("/admin/categories"),

  getServices: () => apiClient.get<Service[]>("/admin/services"),

  getPendingFirms: () => apiClient.get<FirmVerification[]>("/admin/firms/pending"),

  getAllFirms: () => apiClient.get<FirmVerification[]>("/admin/firms"),

  // POST methods
  createCluster: (data: CreateClusterRequest) => apiClient.post<Cluster>("/admin/clusters", data),

  createCategory: (data: CreateCategoryRequest) => apiClient.post<Category>("/admin/categories", data),

  createService: (data: CreateServiceRequest) => apiClient.post<Service>("/admin/services", data),

  // PUT methods
  verifyFirm: (data: VerifyFirmRequest) =>
    apiClient.put<void>(`/admin/firms/${data.firmId}/verify`, {
      status: data.status,
      notes: data.notes,
    }),

  // DELETE methods
  deleteCluster: (id: number) => apiClient.delete(`/admin/clusters/${id}`),

  deleteCategory: (id: number) => apiClient.delete(`/admin/categories/${id}`),

  deleteService: (id: number) => apiClient.delete(`/admin/services/${id}`),
}

import { withAuth, withoutAuth } from "./client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api"

// Translation interface
export interface Translation {
  languageCode: "en" | "ro"
  name: string
  description?: string
}

// DTOs matching backend structure
export interface ClusterDto {
  id: string
  orderInList: number
  icon: string
  isActive: boolean
  translations: Translation[]
  categories: CategoryDto[]
}

export interface CategoryDto {
  id: string
  icon: string
  orderInCluster: number | null
  clusterId: string | null
  translations: Translation[]
  services: ServiceDto[]
}

export interface ServiceDto {
  id: string
  orderInCategory: number
  categoryId: string
  translations: Translation[]
}

// Complete Categories Management API Service
class CategoriesManagementApi {
  // ========================================================================
  // CREATE
  // ========================================================================

  async createCluster(data: { icon: string; translations: Translation[] }): Promise<void> {
    return withAuth(`/categories/clusters`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createCategory(data: {
    icon: string
    orderInCluster?: number
    clusterId?: string
    translations: Translation[]
  }): Promise<void> {
    return withAuth(`/categories/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createService(data: {
    orderInCategory: number
    categoryId: string
    translations: Translation[]
  }): Promise<void> {
    return withAuth(`/categories/services`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // READ
  // ========================================================================

  async getClustersPublic(): Promise<ClusterDto[]> {
    return withoutAuth<ClusterDto[]>(`/categories/clusters`)
  }

  async getClusters(): Promise<ClusterDto[]> {
    return withAuth<ClusterDto[]>(`/categories/clusters`)
  }

  async getUnassignedCategories(): Promise<CategoryDto[]> {
    return withAuth<CategoryDto[]>(`/categories/categories/unassigned`)
  }

  async getSoftDeletedCategories(): Promise<CategoryDto[]> {
    return withAuth<CategoryDto[]>(`/categories/categories/deleted`)
  }

  // ========================================================================
  // SIMPLE UPDATE
  // ========================================================================

  async updateCluster(
    id: string,
    data: {
      icon: string
      isActive: boolean
      translations: Translation[]
    },
  ): Promise<void> {
    return withAuth(`/categories/clusters/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    })
  }

  async updateCategory(
    id: string,
    data: {
      icon: string
      translations: Translation[]
    },
  ): Promise<void> {
    return withAuth(`/categories/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    })
  }

  async updateService(
    id: string,
    data: {
      translations: Translation[]
    },
  ): Promise<void> {
    return withAuth(`/categories/services/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    })
  }

  // ========================================================================
  // BULK UPDATE
  // ========================================================================

  async bulkUpdateClusterCategories(data: {
    clusterId: string
    categories: {
      id?: string
      icon: string
      orderInCluster: number
      translations: Translation[]
    }[]
    removeCategoryIds: string[]
  }): Promise<void> {
    return withAuth(`/categories/clusters/${data.clusterId}/categories/bulk`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async bulkUpdateCategoryServices(data: {
    categoryId: string
    services: {
      id?: string
      orderInCategory: number
      translations: Translation[]
    }[]
    deleteServiceIds: string[]
  }): Promise<void> {
    return withAuth(`/categories/categories/${data.categoryId}/services/bulk`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // DELETE
  // ========================================================================

  async deleteCluster(id: string): Promise<void> {
    return withAuth(`/categories/clusters/${id}`, {
      method: "DELETE",
    })
  }

  async softDeleteCategory(id: string): Promise<void> {
    return withAuth(`/categories/categories/${id}`, {
      method: "DELETE",
    })
  }

  async restoreCategory(id: string): Promise<void> {
    return withAuth(`/categories/categories/${id}/restore`, {
      method: "POST",
    })
  }

  async deleteService(id: string): Promise<void> {
    return withAuth(`/categories/services/${id}`, {
      method: "DELETE",
    })
  }

  // ========================================================================
  // MANAGEMENT
  // ========================================================================

  async reassignCategory(data: {
    categoryId: string
    newClusterId?: string
    orderInCluster?: number
  }): Promise<void> {
    return withAuth(`/categories/categories/${data.categoryId}/reassign`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // REORDER
  // ========================================================================

  async reorderClusters(clusterIds: string[]): Promise<void> {
    return withAuth(`/categories/clusters/reorder`, {
      method: "PUT",
      body: JSON.stringify({ clusterIds }),
    })
  }

  async reorderCategoriesInCluster(clusterId: string, categoryIds: string[]): Promise<void> {
    return withAuth(`/categories/clusters/${clusterId}/categories/reorder`, {
      method: "PUT",
      body: JSON.stringify({ clusterId, categoryIds }),
    })
  }

  async reorderServicesInCategory(categoryId: string, serviceIds: string[]): Promise<void> {
    return withAuth(`/categories/categories/${categoryId}/services/reorder`, {
      method: "PUT",
      body: JSON.stringify({ categoryId, serviceIds }),
    })
  }
}

export const categoriesManagementApi = new CategoriesManagementApi()

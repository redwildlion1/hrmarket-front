import { withAuth } from "./client"

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
  name: string
  description?: string
  orderInList: number
  icon: string
  isActive: boolean
  categories: CategoryDto[]
}

export interface CategoryDto {
  id: string
  name: string
  description?: string
  icon: string
  orderInCluster: number
  clusterId: string | null
  services: ServiceDto[]
}

export interface ServiceDto {
  id: string
  name: string
  description?: string
  orderInCategory: number
  categoryId: string
}

// Complete Categories Management API Service
class CategoriesManagementApi {
  private baseUrl = `${API_BASE_URL}/categories`

  // ========================================================================
  // CREATE
  // ========================================================================

  async createCluster(data: { icon: string; translations: Translation[] }): Promise<void> {
    return withAuth(`${this.baseUrl}/clusters`, {
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
    return withAuth(`${this.baseUrl}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createService(data: {
    orderInCategory: number
    categoryId: string
    translations: Translation[]
  }): Promise<void> {
    return withAuth(`${this.baseUrl}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // READ
  // ========================================================================

  async getClusters(): Promise<ClusterDto[]> {
    return withAuth<ClusterDto[]>(`${this.baseUrl}/clusters`)
  }

  async getUnassignedCategories(): Promise<CategoryDto[]> {
    return withAuth<CategoryDto[]>(`${this.baseUrl}/categories/unassigned`)
  }

  async getSoftDeletedCategories(): Promise<CategoryDto[]> {
    return withAuth<CategoryDto[]>(`${this.baseUrl}/categories/deleted`)
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
    return withAuth(`${this.baseUrl}/clusters/${id}`, {
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
    return withAuth(`${this.baseUrl}/categories/${id}`, {
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
    return withAuth(`${this.baseUrl}/services/${id}`, {
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
    return withAuth(`${this.baseUrl}/clusters/${data.clusterId}/categories/bulk`, {
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
    return withAuth(`${this.baseUrl}/categories/${data.categoryId}/services/bulk`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // DELETE
  // ========================================================================

  async deleteCluster(id: string): Promise<void> {
    return withAuth(`${this.baseUrl}/clusters/${id}`, {
      method: "DELETE",
    })
  }

  async softDeleteCategory(id: string): Promise<void> {
    return withAuth(`${this.baseUrl}/categories/${id}`, {
      method: "DELETE",
    })
  }

  async restoreCategory(id: string): Promise<void> {
    return withAuth(`${this.baseUrl}/categories/${id}/restore`, {
      method: "POST",
    })
  }

  async deleteService(id: string): Promise<void> {
    return withAuth(`${this.baseUrl}/services/${id}`, {
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
    return withAuth(`${this.baseUrl}/categories/${data.categoryId}/reassign`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // ========================================================================
  // REORDER
  // ========================================================================

  async reorderClusters(clusterIds: string[]): Promise<void> {
    return withAuth(`${this.baseUrl}/clusters/reorder`, {
      method: "PUT",
      body: JSON.stringify({ clusterIds }),
    })
  }

  async reorderCategoriesInCluster(clusterId: string, categoryIds: string[]): Promise<void> {
    return withAuth(`${this.baseUrl}/clusters/${clusterId}/categories/reorder`, {
      method: "PUT",
      body: JSON.stringify({ clusterId, categoryIds }),
    })
  }

  async reorderServicesInCategory(categoryId: string, serviceIds: string[]): Promise<void> {
    return withAuth(`${this.baseUrl}/categories/${categoryId}/services/reorder`, {
      method: "PUT",
      body: JSON.stringify({ categoryId, serviceIds }),
    })
  }
}

export const categoriesManagementApi = new CategoriesManagementApi()

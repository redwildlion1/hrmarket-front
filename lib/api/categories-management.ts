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
    isDeleted: any
    id: string
    icon: string
    orderInCluster: number | null
    clusterId: string | null
    translations: Translation[]
    services: ServiceDto[]
    isDeleted: boolean
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
        return withAuth(`/admin/categories/clusters`, {
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
        // Fixed path: /admin/categories + /categories
        return withAuth(`/admin/categories/categories`, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async createService(data: {
        orderInCategory: number
        categoryId: string
        translations: Translation[]
    }): Promise<void> {
        return withAuth(`/admin/categories/services`, {
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
        // Assuming this uses the public endpoint but authenticated, or you can map to a specific admin get
        return withAuth<ClusterDto[]>(`/categories/clusters`)
    }

    async getAllCategories(): Promise<CategoryDto[]> {
        return withAuth<CategoryDto[]>(`/admin/categories/categories`)
    }

    async getUnassignedServices(): Promise<ServiceDto[]> {
        return withAuth<ServiceDto[]>(`/admin/categories/services/unassigned`)
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
        return withAuth(`/admin/categories/clusters/${id}`, {
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
        // Fixed path: /admin/categories + /categories/{id}
        return withAuth(`/admin/categories/categories/${id}`, {
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
        return withAuth(`/admin/categories/services/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...data }),
        })
    }

    // ========================================================================
    // BULK UPDATE (Kept method names, updated paths to be admin-consistent)
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
        return withAuth(`/admin/categories/clusters/${data.clusterId}/categories/bulk`, {
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
        return withAuth(`/admin/categories/categories/${data.categoryId}/services/bulk`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    // ========================================================================
    // DELETE
    // ========================================================================

    async deleteCluster(id: string): Promise<void> {
        return withAuth(`/admin/categories/clusters/${id}`, {
            method: "DELETE",
        })
    }

    async softDeleteCategory(id: string): Promise<void> {
        // Mapped to DeleteCategory in C#
        return withAuth(`/admin/categories/categories/${id}`, {
            method: "DELETE",
        })
    }

    async restoreCategory(id: string): Promise<void> {
        return withAuth(`/admin/categories/categories/${id}/restore`, {
            method: "POST",
        })
    }

    async deleteService(id: string): Promise<void> {
        return withAuth(`/admin/categories/services/${id}`, {
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
        return withAuth(`/admin/categories/categories/${data.categoryId}/reassign`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    // ========================================================================
    // REORDER
    // ========================================================================

    async reorderClusters(clusterIds: string[]): Promise<void> {
        return withAuth(`/admin/categories/clusters/reorder`, {
            method: "PUT",
            body: JSON.stringify({ clusterIds }),
        })
    }

    async reorderCategoriesInCluster(clusterId: string, categoryIds: string[]): Promise<void> {
        return withAuth(`/admin/categories/clusters/${clusterId}/categories/reorder`, {
            method: "PUT",
            body: JSON.stringify({ clusterId, categoryIds }),
        })
    }

    async reorderServicesInCategory(categoryId: string, serviceIds: string[]): Promise<void> {
        return withAuth(`/admin/categories/categories/${categoryId}/services/reorder`, {
            method: "PUT",
            body: JSON.stringify({ categoryId, serviceIds }),
        })
    }

    // ========================================================================
    // NEW C# ENDPOINT METHODS
    // ========================================================================

    async addCategoryToCluster(categoryId: string, clusterId: string): Promise<void> {
        const params = new URLSearchParams({ categoryId, clusterId })
        return withAuth(`/admin/categories/categories/add-to-cluster?${params.toString()}`, {
            method: "POST",
        })
    }

    async removeCategoryFromCluster(categoryId: string): Promise<void> {
        const params = new URLSearchParams({ categoryId })
        return withAuth(`/admin/categories/categories/remove-from-cluster?${params.toString()}`, {
            method: "POST",
        })
    }

    async addServiceToCategory(serviceId: string, categoryId: string): Promise<void> {
        const params = new URLSearchParams({ serviceId, categoryId })
        return withAuth(`/admin/categories/services/add-to-category?${params.toString()}`, {
            method: "POST",
        })
    }

    async removeServiceFromCategory(serviceId: string): Promise<void> {
        const params = new URLSearchParams({ serviceId })
        return withAuth(`/admin/categories/services/remove-from-category?${params.toString()}`, {
            method: "POST",
        })
    }
}

export const categoriesManagementApi = new CategoriesManagementApi()
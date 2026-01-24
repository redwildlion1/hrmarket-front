import { apiClient } from "./client"
import { FirmDetailsForEditingDto } from "./firms"

export interface Cluster {
  id: string
  name: string
  icon: string
  orderInList: number
  categories?: Category[]
}

export interface Category {
  id: string
  name: string
  icon: string
  orderInCluster?: number
  clusterId?: string
  clusterName?: string
  services?: Service[]
}

export interface Service {
  id: string
  name: string
  orderInCategory: number
  categoryId: string
  categoryName?: string
}

export interface SubscriptionPlan {
  id: string
  stripeProductId: string
  isPopular: boolean
  maxCategories: number
  maxArticles: number
  maxOpenJobs: number
  displayOrder: number
  isActive: boolean
  translations: Array<{
    languageCode: string
    name: string
    description: string | null
  }>
  features: Array<{
    order: number
    translations: Array<{
      languageCode: string
      text: string
    }>
  }>
  prices: Array<{
    currency: string
    currencyCode: string
    currencySymbol: string
    monthlyPrice: number
    yearlyPrice: number
    stripePriceIdMonthly: string
    stripePriceIdYearly: string
  }>
}

export interface ContactForm {
    id: string
    name: string
    email: string
    message: string
    personId?: string
    companyId?: string
    accountEmail?: string
    submittedAt: string
    deleted: boolean
}

export const adminApi = {
  // Clusters
  getClusters: async (): Promise<Cluster[]> => {
    return apiClient.categories.getClusters()
  },

  createCluster: async (data: { name: string; icon: string }) => {
    return apiClient.categories.createCluster(data)
  },

  deleteCluster: async (id: number) => {
    return apiClient.categories.deleteCluster(id.toString())
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const clusters = await apiClient.categories.getClusters()
    const categories: Category[] = []

    clusters.forEach((cluster: any) => {
      if (cluster.categories) {
        cluster.categories.forEach((cat: any) => {
          categories.push({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            orderInCluster: cat.orderInCluster,
            clusterId: cluster.id,
            clusterName: cluster.name,
            services: cat.services,
          })
        })
      }
    })

    return categories
  },

  createCategory: async (data: {
    name: string
    icon: string
    clusterId: number
    orderCluster?: number
  }) => {
    return apiClient.categories.createCategory({
      name: data.name,
      icon: data.icon,
      clusterId: data.clusterId.toString(),
      orderCluster: data.orderCluster,
    })
  },

  deleteCategory: async (id: number) => {
    return apiClient.categories.deleteCategory(id.toString())
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const clusters = await apiClient.categories.getClusters()
    const services: Service[] = []

    clusters.forEach((cluster: any) => {
      if (cluster.categories) {
        cluster.categories.forEach((cat: any) => {
          if (cat.services) {
            cat.services.forEach((service: any) => {
              services.push({
                id: service.id,
                name: service.name,
                orderInCategory: service.orderInCategory,
                categoryId: cat.id,
                categoryName: cat.name,
              })
            })
          }
        })
      }
    })

    return services
  },

  createService: async (data: {
    name: string
    categoryId: number
    orderInCategory: number
  }) => {
    return apiClient.categories.createService({
      name: data.name,
      categoryId: data.categoryId.toString(),
      orderInCategory: data.orderInCategory,
    })
  },

  deleteService: async (id: number) => {
    return apiClient.categories.deleteService(id.toString())
  },

  // Subscription Plans (Admin)
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.subscriptions.getPlans()
    return response.plans
  },

  createSubscriptionPlan: async (data: {
    translations: Array<{
      languageCode: string
      name: string
      description?: string
    }>
    features: Array<{
      order: number
      translations: Array<{
        languageCode: string
        text: string
      }>
    }>
    prices: Array<{
      currency: "EUR" | "RON"
      monthlyPrice: number
      yearlyPrice: number
    }>
    isPopular: boolean
    maxCategories: number
    maxArticles: number
    maxOpenJobs: number
    displayOrder: number
  }) => {
    return apiClient.subscriptions.createPlan(data)
  },

  updateSubscriptionPlan: async (
    planId: string,
    data: {
      id: string
      translations: Array<{
        languageCode: string
        name: string
        description?: string
      }>
      features: Array<{
        order: number
        translations: Array<{
          languageCode: string
          text: string
        }>
      }>
      isPopular: boolean
      maxCategories: number
      maxArticles: number
      maxOpenJobs: number
      displayOrder: number
      isActive: boolean
    },
  ) => {
    return apiClient.subscriptions.updatePlan(planId, data)
  },

  deleteSubscriptionPlan: async (planId: string) => {
    return apiClient.subscriptions.deletePlan(planId)
  },

  getFirmsAwaitingReview: async (page = 1, pageSize = 20) => {
    const response = await apiClient.admin.getFirmsAwaitingReview(page, pageSize)
    return response
  },

  verifyFirm: async (data: {
    firmId: string
    status: "approved" | "rejected"
    rejectionReason?: string
    rejectionNote?: string
  }) => {
    return apiClient.admin.verifyFirm(data)
  },

  getFirmForReview: async (firmId: string): Promise<FirmDetailsForEditingDto> => {
    return apiClient.admin.getFirmForReview(firmId)
  },

  // Contact Forms
  getContactForms: async (page = 1, pageSize = 20): Promise<ContactForm[]> => {
    return apiClient.admin.getContactForms(page, pageSize)
  },

  deleteContactForm: async (id: string) => {
    return apiClient.admin.deleteContactForm(id)
  }
}

export interface Cluster {
  id: number
  name: string
  description?: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
  clusterId: number
  clusterName?: string
  createdAt: string
}

export interface Service {
  id: number
  name: string
  description?: string
  categoryId: number
  categoryName?: string
  createdAt: string
}

export interface FirmVerification {
  id: number
  firmName: string
  cui: string
  contactEmail: string
  status: "pending" | "verified" | "rejected"
  submittedAt: string
  verifiedAt?: string
  notes?: string
}

export interface CreateClusterRequest {
  name: string
  description?: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  clusterId: number
}

export interface CreateServiceRequest {
  name: string
  description?: string
  categoryId: number
}

export interface VerifyFirmRequest {
  firmId: number
  status: "verified" | "rejected"
  notes?: string
}

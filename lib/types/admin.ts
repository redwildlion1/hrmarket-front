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
  id: string
  name: string
  cui: string
  ownerEmail: string
  status: number
  submittedForReviewAt: string
  verifiedAt?: string
  notes?: string
  type: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  rejectionReasonType?: number | null
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
  firmId: string
  status: "approved" | "rejected"
  rejectionReason?: string
  rejectionNote?: string
}

export enum FirmRejectionReasonType {
  InappropriateContent = 0,
  FalseInformation = 1,
  MissingDocumentation = 2,
  ViolatesTerms = 3,
  Other = 4
}

import { api, withAuth } from "./client"

// Request types
export interface UploadMediaRequest {
  file: File
  type: "logo" | "cover" | "article" | "event"
}

// Response types
export interface MediaUploadResponse {
  url: string
  id?: string
  fileName: string
  fileSize: number
  mimeType: string
}

export interface Media {
  id: string
  url: string
  type: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: string
}

// Media API methods
export const mediaApi = {
  // POST /firms/:firmId/media
  uploadFirmMedia: async (
    firmId: string,
    file: File,
    type: "logo" | "cover",
    token: string,
  ): Promise<MediaUploadResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await api.post<MediaUploadResponse>(
      `/firms/${firmId}/media`,
      formData,
      withAuth(token, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    )
    return response.data
  },

  // POST /media/upload (generic upload)
  upload: async (file: File, type: string, token: string): Promise<MediaUploadResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await api.post<MediaUploadResponse>(
      "/media/upload",
      formData,
      withAuth(token, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    )
    return response.data
  },

  // GET /media/:id
  getById: async (id: string): Promise<Media> => {
    const response = await api.get<Media>(`/media/${id}`)
    return response.data
  },

  // DELETE /media/:id
  delete: async (id: string, token: string): Promise<void> => {
    await api.delete(`/media/${id}`, withAuth(token))
  },

  // GET /firms/:firmId/media
  getFirmMedia: async (firmId: string): Promise<Media[]> => {
    const response = await api.get<Media[]>(`/firms/${firmId}/media`)
    return response.data
  },
}

export const uploadCompanyMedia = mediaApi.uploadFirmMedia

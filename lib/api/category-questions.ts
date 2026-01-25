import { withAuth } from "./client"
import { QuestionType } from "./questions"

export interface CreateCategoryQuestionOptionDto {
  value: string
  order: number
  translations: {
    languageCode: string
    label: string
    description?: string
  }[]
}

export interface CreateCategoryQuestionDto {
  categoryId: string
  type: QuestionType
  order: number
  isRequired: boolean
  isFilter: boolean
  validationSchema?: string
  translations: {
    languageCode: string
    title: string
    description: string
    placeholder?: string
  }[]
  options: CreateCategoryQuestionOptionDto[]
}

export interface UpdateCategoryQuestionOptionDto {
  optionId?: string
  deleted: boolean
  value?: string
  order: number
  translations: {
    languageCode: string
    label: string
    description?: string
  }[]
}

export interface UpdateCategoryQuestionDto {
  categoryId: string
  deleted: boolean
  type: QuestionType
  order: number
  isRequired: boolean
  isFilter: boolean
  validationSchema?: string
  translations: {
    languageCode: string
    title: string
    description: string
    placeholder?: string
  }[]
  options: UpdateCategoryQuestionOptionDto[]
}

export const categoryQuestionsApi = {
  getDeleted: async () => {
    return withAuth<any[]>("/admin/category-questions/deleted")
  },

  create: async (data: CreateCategoryQuestionDto) => {
    return withAuth("/admin/category-questions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (questionId: string, data: UpdateCategoryQuestionDto) => {
    return withAuth(`/admin/category-questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (questionId: string) => {
    return withAuth(`/admin/category-questions/${questionId}`, {
      method: "DELETE",
    })
  },
}

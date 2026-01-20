import { api, withAuth, withoutAuth } from "./client"

export enum QuestionType {
  String = 1,
  Text = 2,
  Number = 3,
  Date = 4,
  SingleSelect = 5,
  MultiSelect = 6,
}

export interface CategoryQuestionTranslation {
  languageCode: string
  title: string
  description: string
  placeholder?: string
}

export interface CategoryOptionTranslation {
  languageCode: string
  label: string
  description?: string
}

export interface CategoryQuestionOption {
  id: string
  categoryQuestionId: string
  value: string
  order: number
  translations: CategoryOptionTranslation[]
  isActive: boolean
}

export interface CategoryQuestionWithTranslations {
  id: string
  type: QuestionType
  updatedAt: string
  isRequired: boolean
  translations: CategoryQuestionTranslation[]
  options: CategoryQuestionOption[]
}

export interface QuestionsByCategory {
  categoryId: string
  questions: CategoryQuestionWithTranslations[]
}

export interface CategoryAnswerTranslationDto {
  languageCode: string
  text: string
}

export interface SubmitAnswerDto {
  questionId: string
  value?: string
  selectedOptionIds?: string[]
  translations?: CategoryAnswerTranslationDto[]
}

export interface CategoryFormDto {
  firmId?: string
  categoryId: string
  answers: SubmitAnswerDto[]
}

export const questionsApi = {
  getQuestionsByCategory: async (categoryIds: string[]): Promise<QuestionsByCategory[]> => {
    return withoutAuth<QuestionsByCategory[]>("/category-qa/questions/categories", {
        method: "POST",
        body: JSON.stringify(categoryIds)
    })
  },

  submitCategoryForm: async (data: CategoryFormDto): Promise<void> => {
    return withAuth<void>("/category-qa/forms/submit", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

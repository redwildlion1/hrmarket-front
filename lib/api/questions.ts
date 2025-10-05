import { api, withAuth } from "./client"

// Request types
export interface CreateQuestionRequest {
  title: string
  content: string
  categoryId?: number
  tags?: string[]
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

export interface CreateAnswerRequest {
  content: string
  questionId: string
}

// Response types
export interface Question {
  id: string
  title: string
  content: string
  categoryId?: number
  tags?: string[]
  authorId: string
  authorName: string
  views: number
  answers: number
  isResolved: boolean
  createdAt: string
  updatedAt: string
}

export interface Answer {
  id: string
  content: string
  questionId: string
  authorId: string
  authorName: string
  isAccepted: boolean
  votes: number
  createdAt: string
  updatedAt: string
}

export interface QuestionListResponse {
  questions: Question[]
  total: number
  page: number
  pageSize: number
}

// Questions API methods
export const questionsApi = {
  // GET /questions
  getAll: async (params?: {
    page?: number
    pageSize?: number
    categoryId?: number
    search?: string
  }): Promise<QuestionListResponse> => {
    const response = await api.get<QuestionListResponse>("/questions", { params })
    return response.data
  },

  // GET /questions/:id
  getById: async (id: string): Promise<Question> => {
    const response = await api.get<Question>(`/questions/${id}`)
    return response.data
  },

  // POST /questions
  create: async (data: CreateQuestionRequest, token: string): Promise<Question> => {
    const response = await api.post<Question>("/questions", data, withAuth(token))
    return response.data
  },

  // PUT /questions/:id
  update: async (id: string, data: UpdateQuestionRequest, token: string): Promise<Question> => {
    const response = await api.put<Question>(`/questions/${id}`, data, withAuth(token))
    return response.data
  },

  // DELETE /questions/:id
  delete: async (id: string, token: string): Promise<void> => {
    await api.delete(`/questions/${id}`, withAuth(token))
  },

  // POST /questions/:id/resolve
  markAsResolved: async (id: string, token: string): Promise<void> => {
    await api.post(`/questions/${id}/resolve`, {}, withAuth(token))
  },

  // GET /questions/:id/answers
  getAnswers: async (questionId: string): Promise<Answer[]> => {
    const response = await api.get<Answer[]>(`/questions/${questionId}/answers`)
    return response.data
  },

  // POST /questions/:id/answers
  createAnswer: async (data: CreateAnswerRequest, token: string): Promise<Answer> => {
    const response = await api.post<Answer>(`/questions/${data.questionId}/answers`, data, withAuth(token))
    return response.data
  },

  // PUT /answers/:id
  updateAnswer: async (id: string, content: string, token: string): Promise<Answer> => {
    const response = await api.put<Answer>(`/answers/${id}`, { content }, withAuth(token))
    return response.data
  },

  // DELETE /answers/:id
  deleteAnswer: async (id: string, token: string): Promise<void> => {
    await api.delete(`/answers/${id}`, withAuth(token))
  },

  // POST /answers/:id/accept
  acceptAnswer: async (id: string, token: string): Promise<void> => {
    await api.post(`/answers/${id}/accept`, {}, withAuth(token))
  },

  // POST /answers/:id/vote
  voteAnswer: async (id: string, vote: 1 | -1, token: string): Promise<void> => {
    await api.post(`/answers/${id}/vote`, { vote }, withAuth(token))
  },
}

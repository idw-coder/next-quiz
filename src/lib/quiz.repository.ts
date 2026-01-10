import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sanctum_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export interface QuizCategory {
    id: number
    category_name: string
    description: string
    author_id: number
    created_at: string
    updated_at: string
    deleted_at?: string | null
}

export interface Quiz {
    id: number
    category_id: number
    question: string
    explanation: string
}

export interface Choice {
    id: number
    choice_text: string
    is_correct: boolean
}

export const quizRepository = {
    findAllCategory: async (): Promise<QuizCategory[]> => {
        const { data } = await api.get('/quiz-categories')
        return data
    },
    listByCategory: async (categoryId: number): Promise<Quiz[]> => {
        const { data } = await api.get(`/${categoryId}/quizzes`)
        return data
    },
    listByQuiz: async (quizId: number): Promise<Choice[]> => {
        const { data } = await api.get(`/${quizId}/choices`)
        return data
    }
}
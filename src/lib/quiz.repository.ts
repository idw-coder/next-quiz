import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({ baseURL: API_BASE_URL })
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

export interface QuizWithChoices {
    quiz: Quiz
    choices: Choice[]
}

export const quizRepository = {
    findAllCategory: async (): Promise<QuizCategory[]> => {
        const { data } = await api.get('/quiz/categories')
        return data
    },
    listByCategory: async (categoryId: number): Promise<Quiz[]> => {
        const { data } = await api.get(`/quiz/category_${categoryId}/quizzes`)
        return data
    },
    listByQuiz: async (quizId: number): Promise<Choice[]> => {
        const { data } = await api.get(`/quiz/quiz_${quizId}/choices`)
        return data
    },
    getQuizWithChoices: async (quizId: number): Promise<QuizWithChoices> => {
        const { data } = await api.get(`/quiz/quiz_${quizId}`)
        return data
    }
}
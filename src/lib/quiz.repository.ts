import axios from "axios";

const API_BASE_URL = 'http://localhost/api'
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
}

export const quizRepository = {
    findAllCategory: async (): Promise<QuizCategory[]> => {
        const { data } = await api.get('/quiz-categories')
        return data
    }
}
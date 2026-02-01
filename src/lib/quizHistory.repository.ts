import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({ 
    baseURL: API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

export interface QuizHistoryPayload {
    quiz_id: number
    category_id: number
    is_correct: boolean
    answered_at: string
}

export interface QuizHistoryResponse {
    id: number
    user_id: number
    quiz_id: number
    category_id: number
    is_correct: boolean
    answered_at: string
    created_at: string
    updated_at: string
}

export const quizHistoryRepository = {
    getAll: async (): Promise<QuizHistoryResponse[]> => {
        const { data } = await api.get('/quiz/histories')
        return data
    },

    add: async (payload: QuizHistoryPayload): Promise<QuizHistoryResponse> => {
        const { data } = await api.post('/quiz/histories', payload)
        return data
    },

    bulkAdd: async (histories: QuizHistoryPayload[]): Promise<{ message: string; count: number }> => {
        const { data } = await api.post('/quiz/histories/bulk', { histories })
        return data
    },

    clear: async (): Promise<{ message: string }> => {
        const { data } = await api.delete('/quiz/histories')
        return data
    },
}


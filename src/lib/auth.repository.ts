import axios from 'axios'

const API_BASE_URL = 'http://localhost/api'
const api = axios.create({ baseURL: API_BASE_URL})

api.interceptors.request.use((config)  => {
    const token = localStorage.getItem('sanctum_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export interface LoginParams {
    email: string
    password: string
}

export interface RegisterParams {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    sanctum_token: string
    message?: string
}

export const authRepository = {
    login: async (params: LoginParams): Promise<AuthResponse> => {
        const { data } = await api.post('/auth/login', params)
        return data
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
    },

    register: async (params: RegisterParams): Promise<AuthResponse> => {
        const { data } = await api.post('/auth/register', params)
        return data
    } ,
}
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({ 
    baseURL: API_BASE_URL,
    withCredentials: true
})

// CSRFトークンを手動で設定
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
    message?: string
}

export const authRepository = {
    getCsrfCookie: async (): Promise<void> => {
        // Laravel Sanctumがデフォルトで提供しているエンドポイント
        await axios.get(`${API_BASE_URL?.replace('/api', '')}/sanctum/csrf-cookie`, {
            withCredentials: true
        })
    },

    login: async (params: LoginParams): Promise<AuthResponse> => {
        await authRepository.getCsrfCookie()
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
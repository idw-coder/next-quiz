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

export interface PagenatedQuizzes {
    data: Quiz[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface PaginationParams {
    page?: number
    perPage?: number
}

export interface QuizTag {
    id: number
    slug: string
    tag_name: string
    author_id: number
    created_at: string
    updated_at: string
}

export const quizRepository = {
    findAllCategory: async (): Promise<QuizCategory[]> => {
        const { data } = await api.get('/quiz/categories')
        return data
    },

    listByCategory: async (
        categoryId: number,
        params: PaginationParams = {}
    ): Promise<PagenatedQuizzes> => {
        const { page = 1, perPage = 10 } = params
        const { data } = await api.get(
            `/quiz/category_${categoryId}/quizzes`,
        {
            params: {
                page,
                per_page: perPage
            }
        })
        return data
    },

    listByQuiz: async (quizId: number): Promise<Choice[]> => {
        const { data } = await api.get(`/quiz/quiz_${quizId}/choices`)
        return data
    },

    getQuizWithChoices: async (quizId: number): Promise<QuizWithChoices> => {
        const { data } = await api.get(`/quiz/quiz_${quizId}`)
        return data
    },

    getRandomQuizzes: async (
        categoryId: number, count: number = 5, ids?:number[], tagIds?:number[]
    ): Promise<QuizWithChoices[]> => {
        const params: { count: number; ids?: string; tag_ids?: string } = { count };
        if (ids && ids.length > 0) {
            params.ids = ids.join(',');
        }
        if (tagIds && tagIds.length > 0) {
            params.tag_ids = tagIds.join(',');
        }
        const { data } = await api.get<{ quizzes : QuizWithChoices[] }>(
            `/quiz/category_${categoryId}/random`, 
            { params }
        );
        return data.quizzes;
    },

    fetchTags: async (): Promise<QuizTag[]> => {
        const { data } = await api.get('/quiz/tags')
        return data
    },

    fetchTagsByCategory: async (categoryId: number): Promise<QuizTag[]> => {
        const { data } = await api.get(`/quiz/category_${categoryId}/tags`)
        return data
    },
}
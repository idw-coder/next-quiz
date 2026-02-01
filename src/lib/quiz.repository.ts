import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({ baseURL: API_BASE_URL })
export interface QuizCategory {
    id: number
    category_name: string
    description: string
    thumbnail_path?: string | null
    thumbnail_url?: string | null
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
    tags?: { id: number; tag_name: string }[]
}

export interface Choice {
    id: number
    choice_text: string
    is_correct: boolean
}

export interface QuizWithChoices {
    quiz: Quiz
    choices: Choice[]
    tags?: QuizTag[]
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


    findCategory: async (id: number): Promise<QuizCategory> => {
        const { data } = await api.get(`/quiz/categories/${id}`)
        return data
    },

    updateCategory: async (
        id: number,
        params: {
            category_name: string
            description: string
            thumbnail?: File | null
        }
    ): Promise<QuizCategory> => {
        const formData = new FormData()
        formData.append('category_name', params.category_name)
        formData.append('description', params.description)
        if (params.thumbnail) {
            formData.append('thumbnail', params.thumbnail)
        }

        const { data } = await api.post(`/quiz/categories/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
    },

    listByCategory: async (
        categoryId: number,
        params: PaginationParams & { tagIds?: number[]; keyword?: string } = {}
    ): Promise<PagenatedQuizzes> => {
        const { page = 1, perPage = 10, tagIds, keyword } = params
        const { data } = await api.get(
            `/quiz/category_${categoryId}/quizzes`,
        {
            params: {
                page,
                per_page: perPage,
                tag_ids: tagIds?.length ? tagIds.join(',') : undefined,
                keyword: keyword || undefined,
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

    setQuizTagRelations: async (quizId: number, tagIds: number[]): Promise<void> => {
        await api.post(`/quiz/quiz_${quizId}/tags`, { tag_ids: tagIds })
    },

    createTag: async (params: { tag_name: string; slug: string }): Promise<QuizTag> => {
        const { data } = await api.post('/quiz/tags', params)
        return data
    },
    
    updateTag: async (id: number, params: { tag_name: string; slug: string }): Promise<QuizTag> => {
        const { data } = await api.post(`/quiz/tags/${id}`, params)
        return data
    },
    
    deleteTag: async (id: number): Promise<void> => {
        await api.post(`/quiz/tags/${id}/delete`)
    },
}
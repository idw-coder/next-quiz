'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { quizHistoryRepository, QuizHistoryPayload } from '@/lib/quizHistory.repository'

// ISO 8601形式をMySQL互換形式に変換
const toMySQLDatetime = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toISOString().slice(0, 19).replace('T', ' ')
}

export interface QuizAnswer {
    quizId: number
    categoryId: number
    isCorrect: boolean
    answeredAt: string
}

interface QuizHistoryData {
    answers: QuizAnswer[]
}

const STORAGE_KEY = 'quiz_history'

export const QUIZ_HISTORY_QUERY_KEY = ['quizHistory'] as const

const loadFromStorage = (): QuizAnswer[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []
        const data: QuizHistoryData = JSON.parse(stored)
        return data.answers || []
    } catch (error) {
        console.error('Failed to load quiz history:', error)
        return []
    }
}

const saveToStorage = (answers: QuizAnswer[]): void => {
    if (typeof window === 'undefined') return

    try {
        const data: QuizHistoryData = { answers }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
        console.error('Failed to save quiz history:', error)
    }
}

export const clearLocalStorage = (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
}

export const getLocalStorageHistories = (): QuizAnswer[] => {
    return loadFromStorage()
}

export const syncLocalHistoryToServer = async (): Promise<void> => {
    const localHistories = loadFromStorage()
    if (localHistories.length === 0) return

    const validHistories = localHistories.filter(h => 
        h.quizId != null && 
        h.categoryId != null && 
        h.isCorrect != null && 
        h.answeredAt != null
    )

    if (validHistories.length === 0) {
        clearLocalStorage()
        return
    }

    try {
        const payloads: QuizHistoryPayload[] = validHistories.map(h => ({
            quiz_id: h.quizId,
            category_id: h.categoryId,
            is_correct: h.isCorrect,
            answered_at: toMySQLDatetime(h.answeredAt),
        }))
        await quizHistoryRepository.bulkAdd(payloads)
        clearLocalStorage()
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: unknown } }
            console.error('Validation error details:', axiosError.response?.data)
        }
        console.error('Failed to sync local history to server:', error)
    }
}

export function useQuizHistory() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const queryClient = useQueryClient()

    // React Queryでデータ取得・キャッシュ
    const { data: answers = [], isLoading } = useQuery<QuizAnswer[]>({
        queryKey: QUIZ_HISTORY_QUERY_KEY,
        queryFn: async () => {
            if (isAuthenticated) {
                const serverHistories = await quizHistoryRepository.getAll()
                return serverHistories.map(h => ({
                    quizId: h.quiz_id,
                    categoryId: h.category_id,
                    isCorrect: h.is_correct,
                    answeredAt: h.answered_at,
                }))
            } else {
                return loadFromStorage()
            }
        },
        enabled: !authLoading,
        staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    })

    const loading = authLoading || isLoading

    // 回答追加のmutation
    const addMutation = useMutation({
        mutationFn: async ({ quizId, categoryId, isCorrect }: { quizId: number; categoryId: number; isCorrect: boolean }) => {
            const newAnswer: QuizAnswer = {
                quizId,
                categoryId,
                isCorrect,
                answeredAt: toMySQLDatetime(new Date().toISOString()),
            }

            if (isAuthenticated) {
                await quizHistoryRepository.add({
                    quiz_id: quizId,
                    category_id: categoryId,
                    is_correct: isCorrect,
                    answered_at: newAnswer.answeredAt,
                })
            }

            return newAnswer
        },
        onSuccess: (newAnswer) => {
            // キャッシュを更新
            queryClient.setQueryData<QuizAnswer[]>(QUIZ_HISTORY_QUERY_KEY, (old = []) => {
                const updated = [...old, newAnswer]
                if (!isAuthenticated) {
                    saveToStorage(updated)
                }
                return updated
            })
        },
        onError: (error) => {
            console.error('Failed to add answer:', error)
        },
    })

    // 履歴クリアのmutation
    const clearMutation = useMutation({
        mutationFn: async () => {
            if (isAuthenticated) {
                await quizHistoryRepository.clear()
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        },
        onSuccess: () => {
            queryClient.setQueryData<QuizAnswer[]>(QUIZ_HISTORY_QUERY_KEY, [])
        },
        onError: (error) => {
            console.error('Failed to clear history:', error)
        },
    })

    const addAnswer = useCallback((quizId: number, categoryId: number, isCorrect: boolean): void => {
        addMutation.mutate({ quizId, categoryId, isCorrect })
    }, [addMutation])

    const getLatestAnswer = useCallback((quizId: number): QuizAnswer | null => {
        const filtered = answers.filter((a) => a.quizId === quizId)
        if (filtered.length === 0) return null
        return filtered[filtered.length - 1]
    }, [answers])

    const getAnswerHistory = useCallback((quizId: number): QuizAnswer[] => {
        return answers.filter((a) => a.quizId === quizId)
    }, [answers])

    const clearHistory = useCallback((): void => {
        clearMutation.mutate()
    }, [clearMutation])

    const getWrongQuizIdsByCategory = useCallback((categoryId: number): number[] => {
        const latestByQuiz = new Map<number, QuizAnswer>();

        answers.filter((a) => a.categoryId === categoryId)
            .forEach((a) => latestByQuiz.set(a.quizId, a));

        return Array.from(latestByQuiz.entries()).filter(([_, answer]) => !answer.isCorrect)
            .map(([quizId, _]) => quizId); 
    }, [answers])

    return {
        answers,
        loading,
        addAnswer,
        getLatestAnswer,
        getAnswerHistory,
        clearHistory,
        getWrongQuizIdsByCategory
    }
}

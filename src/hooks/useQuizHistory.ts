'use client'

import { useState, useEffect } from 'react'

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

export function useQuizHistory() {
    const [answers, setAnswers] = useState<QuizAnswer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loaded = loadFromStorage()
        setAnswers(loaded)
        setLoading(false)
    }, [])

    useEffect(() => {
        if (!loading) {
            saveToStorage(answers)
        }
    }, [answers, loading])

    const addAnswer = (quizId: number, categoryId: number, isCorrect: boolean): void => {
        const newAnswer: QuizAnswer = {
            quizId,
            categoryId,
            isCorrect,
            answeredAt: new Date().toISOString(),
        }
        setAnswers((prev) => [...prev, newAnswer])
    }

    const getLatestAnswer = (quizId: number): QuizAnswer | null => {
        const filtered = answers.filter((a) => a.quizId === quizId)
        if (filtered.length === 0) return null
        return filtered[filtered.length - 1]
    }

    const getAnswerHistory = (quizId: number): QuizAnswer[] => {
        return answers.filter((a) => a.quizId === quizId)
    }

    const clearHistory = (): void => {
        setAnswers([])
        localStorage.removeItem(STORAGE_KEY)
    }

    const getWrongQuizIdsByCategory = (categoryId: number): number[] => {
        const latestByQuiz = new Map<number, QuizAnswer>();

        answers.filter((a) => a.categoryId === categoryId)
            .forEach((a) => latestByQuiz.set(a.quizId, a));

        return Array.from(latestByQuiz.entries()).filter(([_, answer]) => !answer.isCorrect)
            .map(([quizId, _]) => quizId); 
    }

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
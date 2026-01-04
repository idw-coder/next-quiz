'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { userRepository, getUserImageUrl, type User } from '@/lib/user.repository'
import { authRepository } from '@/lib/auth.repository'

export function useAuth() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('sanctum_token')

        if (!token) {
            setIsAuthenticated(false)
            setLoading(false)
            return
        }

        setIsAuthenticated(true)

        const fetchProfile = async () => {
            try {
                const data = await userRepository.getProfile()
                setUser(data)
            } catch (error) {
                console.error('プロフィール取得エラー ', error)

                localStorage.removeItem('sanctum_token') // TODO
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const logout = async () => {
        try {
            await authRepository.logout()
        } catch (error) {
            console.error('ログアウトエラー ', error)
        }
        localStorage.removeItem('sanctum_token')
        setIsAuthenticated(false)
        setUser(null)
        router.push('/signin')
    }

    return {
        isAuthenticated,
        user,
        loading,
        logout,
        profileImageUrl: getUserImageUrl(user?.profile_image),
    }
}
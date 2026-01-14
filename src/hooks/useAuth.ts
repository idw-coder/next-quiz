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
        const fetchProfile = async () => {

            // const hasSession = document.cookie.includes('laravel_session')
            // if (!hasSession) {
            //     setIsAuthenticated(false)
            //     setLoading(false)
            //     return
            // }

            try {
                const data = await userRepository.getProfile()
                setUser(data)
                setIsAuthenticated(true)
            } catch (error) {
                console.error('プロフィール取得エラー ', error)
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
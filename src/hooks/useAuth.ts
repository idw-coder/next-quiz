'use client'

import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userRepository, getUserImageUrl, type User } from '@/lib/user.repository'
import { authRepository } from '@/lib/auth.repository'

// クエリキーを定数化（他のファイルからも使えるようにexport）
export const USER_QUERY_KEY = ['user'] as const

export function useAuth() {
    const router = useRouter()
    const queryClient = useQueryClient()

    // React Queryでユーザー情報を取得・キャッシュ
    const { data: user, isLoading, isError } = useQuery<User | null>({
        queryKey: USER_QUERY_KEY,
        queryFn: async () => {
            try {
                return await userRepository.getProfile()
            } catch (error) {
                console.error('プロフィール取得エラー ', error)
                return null
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
    })

    const logout = async () => {
        try {
            await authRepository.logout()
        } catch (error) {
            console.error('ログアウトエラー ', error)
        }
        queryClient.setQueryData(USER_QUERY_KEY, null) // キャッシュをクリア
        router.push('/signin')
    }

    return {
        isAuthenticated: !!user,
        user: user ?? null,
        loading: isLoading,
        logout,
        profileImageUrl: getUserImageUrl(user?.profile_image),
    }
}
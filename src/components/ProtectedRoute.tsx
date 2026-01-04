'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, loading} = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated === false) {
        router.push('/signin')
    }
  }, [isAuthenticated, loading, router])

  // 認証チェック中
  if (loading || isAuthenticated === null) {
    return <div>Loading...</div>
  }
  return <>{children}</>
}
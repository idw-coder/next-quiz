'use client'

import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { userRepository, getUserImageUrl } from '@/lib/user.repository'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function ProfileContent() {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
    })

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: userRepository.getProfile,
    })

    useEffect(() => {
        if (profile) {
            setFormData({ name: profile.name, email: profile.email })
        }
    }, [profile])

    const updateProfileMutation = useMutation({
        mutationFn: userRepository.updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] }) // TODO
            alert(data.message || 'プロフィール更新しました')
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'プロフィールの更新に失敗しました'
            alert(errorMessage)
        }
    })

    const updatePasswordMutation = useMutation({
        mutationFn: userRepository.updatePassword,
        onSuccess: (data) => {
            alert(data.message || 'パスワードを更新しました')
            setPasswordData({ current_password: '', new_password: '' })
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'パスワードのの更新に失敗しました'
            alert(errorMessage)
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: userRepository.uploadProfileImage,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] }) // TODO
            alert(data.message || 'プロフィール画像を更新しました')
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'プロフィール画像の更新に失敗しました'
            alert(errorMessage)
        }
    })

    const deleteImageMutation = useMutation({
      mutationFn: userRepository.deleteProfileImage,
      onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['profile'] }) // TODO
          alert(data.message || 'プロフィール画像を削除しました')
      },
      onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : 'プロフィール画像の削除に失敗しました'
          alert(errorMessage)
      }
  })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({...prev, [e.target.id]: e.target.value }))
    }
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData((prev) => ({...prev, [e.target.id]: e.target.value }))
    }

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!window.confirm('プロフィールを更新してもよろしいですか？')) {
            return
        }
        updateProfileMutation.mutate(formData) // TODO
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!window.confirm('パスワードを更新してもよろしいですか？')) {
            return
        }
        updatePasswordMutation.mutate(passwordData) // TODO
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!window.confirm('プロフィール画像を更新してもよろしいですか？')) {
            e.target.value = ''
            return
        }
        uploadImageMutation.mutate(file) // TODO
    }

    
    const handleImageDelete = async () => {
        if (!window.confirm('プロフィール画像を削除してもよろしいですか？この操作は取り消せません')) {
            return
        }
        deleteImageMutation.mutate() // TODO
    }

    const isAnyLoading = isLoading || 
        updateProfileMutation.isPending || 
        updatePasswordMutation.isPending || 
        uploadImageMutation.isPending || 
        deleteImageMutation.isPending

    if (isLoading) {
        return <div>読み込み中...</div>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', fontSize: '12px' }}>
          {/* プロフィール画像セクション */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {profile?.profile_image ? (
              <img
                src={getUserImageUrl(profile.profile_image) || ''}
                alt="プロフィール画像"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  border: '1px solid #ccc',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '120px',
                  borderRadius: '0%',
                  border: '1px solid #ccc',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountCircle style={{ fontSize: '100px', color: '#666' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <Button variant="outlined" size="small" component="span" disabled={isAnyLoading}>
                  新しく画像をアップロード
                </Button>
              </label>
              {profile?.profile_image && (
                <Button variant="outlined" color="error" size="small" onClick={handleImageDelete} disabled={isAnyLoading}>
                  削除
                </Button>
              )}
            </div>
          </div>
    
          {/* プロフィール情報更新フォーム */}
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ textAlign: 'center', margin: '0' }}>プロフィール情報</h3>
            {profile?.role && (
              <div>
                <p style={{ margin: '0', fontSize: '12px', textAlign: 'center', background: '#eee' }}>{profile.role}</p>
              </div>
            )}
            <div>
              <label htmlFor="name">名前</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label htmlFor="email">メールアドレス</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <Button type="submit" variant="contained" size="small" disabled={isAnyLoading}>
              {updateProfileMutation.isPending ? '更新中...' : 'プロフィールを更新'}
            </Button>
          </form>
    
          {/* パスワード更新フォーム */}
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ textAlign: 'center', margin: '0' }}>パスワード変更</h3>
            <div>
              <label htmlFor="current_password">現在のパスワード</label>
              <input
                id="current_password"
                type="password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label htmlFor="new_password">新しいパスワード</label>
              <input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
                minLength={8}
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <Button type="submit" variant="contained" size="small" disabled={isAnyLoading}>
              {updatePasswordMutation.isPending ? '更新中...' : 'パスワードを更新'}
            </Button>
          </form>
        </div>
      )
    }
    
    export default function Profile() {
      return (
        <ProtectedRoute>
          <ProfileContent />
        </ProtectedRoute>
      )
}
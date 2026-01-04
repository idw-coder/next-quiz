'use client'

import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { userRepository, getUserImageUrl } from '@/lib/user.repository'
import ProtectedRoute from '@/components/ProtectedRoute'

function ProfileContent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
    })
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: false,
        message: '',
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userRepository.getProfile()
                setFormData({ name: data.name, email: data.email })
                setProfileImage(data.profile_image || null)
            } catch (error) {
                /**
                 * errorオブジェクトはunknown型ですがError型として扱えるように
                 * 「instanceof」を使用
                 */
                const errorMessage = error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました'
                setStatus({ loading: false, success: false, error: true, message: errorMessage })
            }
        }
        fetchProfile()
    }, [])

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
        setStatus({ loading: true, success: false, error: false, message: '' })
        try {
            const data = await userRepository.updateProfile(formData)
            setStatus({ loading: false, success: true, error: false, message: data.message || 'プロフィールを更新しました' })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'プロフィールの更新に失敗しました'
            setStatus({ loading: false, success: false, error: true, message: errorMessage })
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!window.confirm('パスワードを更新してもよろしいですか？')) {
            return
        }
        setStatus({ loading: true, success: false, error: false, message: '' })
        try {
            const data = await userRepository.updatePassword(passwordData)
            setStatus({ loading: false, success: true, error: false, message: data.message || 'パスワードを更新しました' })
            setPasswordData({ current_password: '', new_password: '' })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'パスワードの更新に失敗しました'
            setStatus({ loading: false, success: false, error: true, message: errorMessage })
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!window.confirm('プロフィール画像を更新してもよろしいですか？')) {
            e.target.value = ''
            return
        }

        setStatus({ loading: true, success: false, error: false, message: '' })
        try {
            const data = await userRepository.uploadProfileImage(file)
            setStatus({ loading: false, success: true, error: false, message: data.message || 'プロフィール画像を更新しました' })
            setProfileImage(data.profile_image || null)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'プロフィール画像の更新に失敗しました'
            setStatus({ loading: false, success: false, error: true, message: errorMessage })
        }
    }

    
    const handleImageDelete = async () => {
        if (!window.confirm('プロフィール画像を削除してもよろしいですか？この操作は取り消せません')) {
            return
        }

        setStatus({ loading: true, success: false, error: false, message: '' })
        try {
            const data = await userRepository.deleteProfileImage()
            setStatus({ loading: false, success: true, error: false, message: data.message || 'プロフィール画像を削除しました' })
            setProfileImage(null)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'プロフィール画像の削除に失敗しました'
            setStatus({ loading: false, success: false, error: true, message: errorMessage })
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', fontSize: '12px' }}>
          {/* プロフィール画像セクション */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {profileImage ? (
              <img
                src={getUserImageUrl(profileImage) || ''}
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
                <Button variant="outlined" size="small" component="span" disabled={status.loading}>
                  新しく画像をアップロード
                </Button>
              </label>
              {profileImage && (
                <Button variant="outlined" color="error" size="small" onClick={handleImageDelete} disabled={status.loading}>
                  削除
                </Button>
              )}
            </div>
          </div>
    
          {/* プロフィール情報更新フォーム */}
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ textAlign: 'center', margin: '0' }}>プロフィール情報</h3>
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
            <Button type="submit" variant="contained" size="small" disabled={status.loading}>
              {status.loading ? '更新中...' : 'プロフィールを更新'}
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
            <Button type="submit" variant="contained" size="small" disabled={status.loading}>
              {status.loading ? '更新中...' : 'パスワードを更新'}
            </Button>
          </form>
    
          {/* ステータスメッセージ */}
          {status.error && <p style={{ color: 'red' }}>{status.message}</p>}
          {status.success && <p style={{ color: 'green' }}>{status.message}</p>}
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
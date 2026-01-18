'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, MenuItem } from '@mui/material'
import { AccountCircle, Terminal } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'


export default function Header() {
    const router = useRouter()
    const { isAuthenticated, loading, logout, profileImageUrl, user } = useAuth()
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
    const isUserMenuOpen = Boolean(userMenuAnchor)

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget)
    }

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null)
    }

    const handleProfileClick = () => {
        handleUserMenuClose()
        router.push('/profile')
    }

    const handleLogoutClick = async () => {
        handleUserMenuClose()
        await logout()
    }

    return (
        <div style={{ borderBottom: '1px solid #ccc' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1000px',
          minHeight: '48px',
          boxSizing: 'border-box',
          margin: '0 auto',
          padding: '0.6rem 1rem',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          <a href="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Terminal sx={{ fontSize: '1.4rem', color: '#333' }} />
            <span>Web開発者向けクイズ</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666', borderLeft: '1px solid #ccc', paddingLeft: '0.5rem' }} className="hidden sm:inline">
              完全無料・登録不要
            </span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', fontSize: '14px' }}>
          {/* <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              問題集一覧
          </a> */}
          {loading ? null : user?.role === 'admin' && (
            <a href="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
              ユーザー一覧
            </a>
          )}
          {loading ? null : isAuthenticated ? (
            <>
              <div
                onClick={handleUserMenuOpen}
                onMouseEnter={handleUserMenuOpen}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="プロフィール"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AccountCircle style={{ fontSize: '32px', color: '#666' }} />
                )}
              </div>
              <Menu
                anchorEl={userMenuAnchor}
                open={isUserMenuOpen}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem sx={{ fontSize: '14px' }} onClick={handleProfileClick}>
                  プロフィール
                </MenuItem>
                <MenuItem sx={{ fontSize: '14px' }} onClick={handleLogoutClick}>
                  ログアウト
                </MenuItem>
              </Menu>
            </>
          ) : (
            <a href="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
              ログイン
            </a>
          )}
        </div>
      </div>
    </div>
    )
}
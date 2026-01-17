'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Link } from '@mui/material'
import { authRepository } from '@/lib/auth.repository'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        try {
            await authRepository.register({ name, email, password })
            router.push('/signin')
        } catch (error) {
            alert('新規登録に失敗しました')
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '14px' }}>
            既にアカウントを持っている場合は<Link href="/signin">ログイン</Link>から
          </p>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid #ccc',
              padding: '1rem 2rem',
              borderRadius: '0.25rem',
              maxWidth: '300px',
              fontSize: '12px',
            }}
          >
            <div>
              <label htmlFor="name">名前</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label htmlFor="email">メールアドレス</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="test@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label htmlFor="password">パスワード</label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="password123"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
              />
            </div>
            <Button type="submit" variant="contained" size="small">
              新規登録
            </Button>
          </form>
        </div>
      )
}
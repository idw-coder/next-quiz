'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@mui/material'
import { Image as ImageIcon } from 'lucide-react'
import { quizRepository } from '@/lib/quiz.repository'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function EditCategoryContent() {
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        category_name: '',
        description: '',
        display_order: '' as string,
    })
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const { data: category, isLoading } = useQuery({
        queryKey: ['category', id],
        queryFn: () => quizRepository.findCategory(id),
    })

    useEffect(() => {
        if (category) {
            setFormData({
                category_name: category.category_name,
                description: category.description || '',
                display_order: category.display_order != null ? String(category.display_order) : '',
            })
            if (category.thumbnail_url) {
                setPreviewUrl(category.thumbnail_url)
            }
        }
    }, [category])

    const updateMutation = useMutation({
        mutationFn: (params: { category_name: string; description: string; thumbnail?: File | null }) =>
            quizRepository.updateCategory(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['category', id] })
            alert('カテゴリを更新しました')
            router.push('/home')
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'カテゴリの更新に失敗しました'
            alert(errorMessage)
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setThumbnail(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!window.confirm('カテゴリを更新してもよろしいですか？')) {
            return
        }
        updateMutation.mutate({
            category_name: formData.category_name,
            description: formData.description,
            thumbnail: thumbnail,
            display_order: formData.display_order !== '' ? Number(formData.display_order) : null,
        })
    }

    if (isLoading) {
        return <div>読み込み中...</div>
    }

    return (
        <div style={{ maxWidth: '400px', fontSize: '12px' }}>
            <h2 style={{ marginBottom: '1rem' }}>カテゴリ編集</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* サムネイル */}
                <div style={{ marginBottom: '1rem' }}>
                    <label>サムネイル</label>
                    <div
                        style={{
                            width: '200px',
                            height: '120px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '0.25rem',
                        }}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageIcon size={48} color="#999" />
                        )}
                    </div>
                    <label style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        <Button variant="outlined" size="small" component="span" disabled={updateMutation.isPending}>
                            画像を選択
                        </Button>
                    </label>
                </div>

                {/* カテゴリ名 */}
                <div>
                    <label htmlFor="category_name">カテゴリ名 *</label>
                    <input
                        id="category_name"
                        type="text"
                        value={formData.category_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
                    />
                </div>

                {/* 説明 */}
                <div>
                    <label htmlFor="description">説明</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
                    />
                </div>

                {/* 表示順 */}
                <div>
                    <label htmlFor="display_order">表示順</label>
                    <input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={handleChange}
                        placeholder="未設定（最後に表示）"
                        style={{ width: '100%', padding: '0.4rem 0.8rem', boxSizing: 'border-box' }}
                    />
                    <span style={{ fontSize: '10px', color: '#666' }}>
                        小さい値ほど上位に表示されます。未設定の場合は最後に表示されます。
                    </span>
                </div>

                <Button type="submit" variant="contained" size="small" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? '更新中...' : '更新'}
                </Button>
            </form>
        </div>
    )
}

export default function EditCategory() {
    return (
        <ProtectedRoute>
            <EditCategoryContent />
        </ProtectedRoute>
    )
}
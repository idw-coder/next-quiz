'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
    Button, 
    Card, 
    CardContent, 
    LinearProgress, 
    Chip,
    Box,
    Typography,
    Collapse,
    IconButton,
} from '@mui/material'
import { AccountCircle, CheckCircle, Cancel, ExpandMore, ExpandLess } from '@mui/icons-material'
import { userRepository, getUserImageUrl } from '@/lib/user.repository'
import { quizRepository, QuizCategory } from '@/lib/quiz.repository'
import { useQuizHistory, QuizAnswer } from '@/hooks/useQuizHistory'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface CategoryHistory {
    category: QuizCategory
    answers: QuizAnswer[]
    correctCount: number
    totalCount: number
}

function CategoryCard({ category, answers, correctCount, totalCount }: CategoryHistory) {
    const [expanded, setExpanded] = useState(false)
    const percentage = Math.round((correctCount / totalCount) * 100)
    
    const getProgressColor = (pct: number) => {
        if (pct >= 80) return 'success'
        if (pct >= 50) return 'warning'
        return 'error'
    }

    return (
        <Card variant="outlined" sx={{ mb: 1.5 }}>
            <CardContent sx={{ pb: 1, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {category.category_name}
                    </Typography>
                    <Chip 
                        label={`${percentage}%`}
                        size="small"
                        color={getProgressColor(percentage)}
                        sx={{ fontWeight: 'bold', minWidth: 50 }}
                    />
                </Box>
                
                <Box sx={{ mb: 1 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        color={getProgressColor(percentage)}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        {correctCount} / {totalCount} 問正解
                    </Typography>
                    <IconButton 
                        size="small" 
                        onClick={() => setExpanded(!expanded)}
                        sx={{ p: 0.5 }}
                    >
                        {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </IconButton>
                </Box>
                
                <Collapse in={expanded}>
                    <Box sx={{ mt: 1, maxHeight: 200, overflowY: 'auto' }}>
                        {answers.slice(0, 10).map((answer, idx) => (
                            <Box 
                                key={`${answer.quizId}-${answer.answeredAt}-${idx}`}
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    py: 0.5,
                                    borderBottom: idx < Math.min(answers.length, 10) - 1 ? '1px solid #eee' : 'none',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {answer.isCorrect ? (
                                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                    ) : (
                                        <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
                                    )}
                                    <Typography variant="caption">Quiz #{answer.quizId}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(answer.answeredAt).toLocaleDateString('ja-JP', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                            </Box>
                        ))}
                        {answers.length > 10 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', pt: 0.5 }}>
                                他 {answers.length - 10} 件
                            </Typography>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    )
}

function QuizHistorySection() {
    const { answers, loading: historyLoading } = useQuizHistory()

    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: quizRepository.findAllCategory,
    })

    // 各問題の最新回答のみを抽出するヘルパー
    const getLatestAnswersByQuiz = (answerList: QuizAnswer[]): Map<number, QuizAnswer> => {
        const latestByQuiz = new Map<number, QuizAnswer>()
        // 日時順にソートして、各quizIdの最新を取得
        const sorted = [...answerList].sort((a, b) => 
            new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime()
        )
        sorted.forEach(answer => {
            latestByQuiz.set(answer.quizId, answer)
        })
        return latestByQuiz
    }

    const categoryHistories = useMemo((): CategoryHistory[] => {
        if (!categories.length || !answers.length) return []

        const grouped = new Map<number, QuizAnswer[]>()
        
        answers.forEach(answer => {
            const existing = grouped.get(answer.categoryId) || []
            grouped.set(answer.categoryId, [...existing, answer])
        })

        return categories
            .filter(cat => grouped.has(cat.id))
            .map(cat => {
                const catAnswers = grouped.get(cat.id) || []
                // 各問題の最新回答のみで正解率を計算
                const latestAnswers = getLatestAnswersByQuiz(catAnswers)
                const correctCount = Array.from(latestAnswers.values()).filter(a => a.isCorrect).length
                return {
                    category: cat,
                    answers: catAnswers.sort((a, b) => 
                        new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
                    ),
                    correctCount,
                    totalCount: latestAnswers.size, // ユニークな問題数
                }
            })
            .sort((a, b) => b.answers[0].answeredAt.localeCompare(a.answers[0].answeredAt))
    }, [categories, answers])

    // 全体の統計（各問題の最新回答のみ）
    const totalStats = useMemo(() => {
        const latestAnswers = getLatestAnswersByQuiz(answers)
        const total = latestAnswers.size
        const correct = Array.from(latestAnswers.values()).filter(a => a.isCorrect).length
        return { total, correct, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 }
    }, [answers])

    if (historyLoading || categoriesLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <LinearProgress />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                    履歴を読み込み中...
                </Typography>
            </Box>
        )
    }

    if (categoryHistories.length === 0) {
        return (
            <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        まだクイズの回答履歴がありません
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Box>
            {/* 説明 */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                ※ 各問題の最新の回答結果で正解率を計算しています
            </Typography>

            {/* 全体統計 */}
            <Card variant="outlined" sx={{ mb: 2, bgcolor: '#fafafa' }}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">総合成績</Typography>
                        <Chip 
                            label={`${totalStats.percentage}%`}
                            color={totalStats.percentage >= 80 ? 'success' : totalStats.percentage >= 50 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={totalStats.percentage}
                        color={totalStats.percentage >= 80 ? 'success' : totalStats.percentage >= 50 ? 'warning' : 'error'}
                        sx={{ height: 10, borderRadius: 5, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {totalStats.total} 問中 {totalStats.correct} 問正解
                    </Typography>
                </CardContent>
            </Card>

            {/* カテゴリ別 */}
            {categoryHistories.map((history) => (
                <CategoryCard key={history.category.id} {...history} />
            ))}
        </Box>
    )
}

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
            queryClient.invalidateQueries({ queryKey: ['profile'] })
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
            queryClient.invalidateQueries({ queryKey: ['profile'] })
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
            queryClient.invalidateQueries({ queryKey: ['profile'] })
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
        updateProfileMutation.mutate(formData)
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!window.confirm('パスワードを更新してもよろしいですか？')) {
            return
        }
        updatePasswordMutation.mutate(passwordData)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!window.confirm('プロフィール画像を更新してもよろしいですか？')) {
            e.target.value = ''
            return
        }
        uploadImageMutation.mutate(file)
    }

    
    const handleImageDelete = async () => {
        if (!window.confirm('プロフィール画像を削除してもよろしいですか？この操作は取り消せません')) {
            return
        }
        deleteImageMutation.mutate()
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
        <div 
            style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '2rem',
                padding: '2rem',
                maxWidth: '900px',
                margin: '0 auto',
            }}
            className="profile-layout"
        >
            <style>{`
                @media (min-width: 768px) {
                    .profile-layout {
                        grid-template-columns: 320px 1fr !important;
                    }
                }
            `}</style>

            {/* 左カラム: プロフィール情報 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '12px' }}>
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

            {/* 右カラム: クイズ履歴 */}
            <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px' }}>クイズ回答履歴</h3>
                <QuizHistorySection />
            </div>
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

import axios from 'axios'

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profile_image?: string | null;
  role?: string;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL
const api = axios.create({baseURL: API_BASE_URL})


// 認証ヘッダーを取得する処理を挟む
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('sanctum_token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

/**
 * 画像URLを取得
 */
export const getUserImageUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath) return null;
  return imagePath.startsWith("http")
    ? imagePath
    : `${STORAGE_BASE_URL}/${imagePath.replace(/^\//, "")}`;
};

export const userRepository = {
	getProfile: async (): Promise<User> => {
		const { data } = await api.get('/user')
		return data
	},

	updateProfile: async (params: Pick<User, 'name' | 'email'>): Promise<User> => {
		const { data } = await api.post('/user', params)
		return data
	},

	uploadProfileImage: async (file: File): Promise<User> => {
		/**
		 * ファイルをアップロードするためのFormDataオブジェクトを作成
		 */
		const formData = new FormData()
		formData.append('profile_image', file)

		const { data } = await api.post('/user/image', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return data
	},

	deleteProfileImage: async(): Promise<User> => {
		const { data } = await api.post('/user/image/delete')
		return data
	},

	updatePassword: async (params: { current_password: string; new_password: string }): Promise<User> => {
		const { data } = await api.post('/user/password', params)
		return data
	},

  // ============================================
  // 管理者用 ユーザー管理操作
  // ============================================
	findAll: async (): Promise<User[]> => {
		const { data } = await api.get('/users')
		return data
	},

	findOne: async (id: number): Promise<User> => {
		const { data } = await api.get(`/users/${id}`)
		return data
	},

	update: async (id: number, params: { name?: string; email?: string; role?: string }): Promise<User> => {
		const { data } = await api.post(`/users/${id}`, params)
		return data
	},

	delete: async (id: number): Promise<User> => {
		const { data } = await api.post(`/users/${id}/delete`)
		return data
	},

	updateImage: async (id: number, file: File): Promise<User> => {
		const formData = new FormData()
		formData.append('profile_image', file)
		const { data } = await api.post(`/users/${id}/image`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return data
	},

	deleteImage: async (id: number): Promise<User> => {
		const { data } = await api.post(`/users/${id}/image/delete`)
		return data
	},

	resetPassword: async (id: number, newPassword: string): Promise<User> => {
		const { data } = await api.post(`/users/${id}/password/reset`, { new_password: newPassword})
		return data
	},

	restore: async (id: number): Promise<User> => {
		const { data } = await api.post(`/users/${id}/restore`)
		return data
	},

	findAllRoles: async (): Promise<string[]> => {
		const { data } = await api.get('/users/roles')
		return Array.isArray(data) ? data : [] // TODO
	},
}
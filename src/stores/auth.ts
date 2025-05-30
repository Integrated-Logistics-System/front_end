import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response: AuthResponse = await apiClient.login({ email, password })
          
          // Store token in localStorage
          localStorage.setItem('access_token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response: AuthResponse = await apiClient.register({ email, password, name })
          
          // Store token in localStorage
          localStorage.setItem('access_token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

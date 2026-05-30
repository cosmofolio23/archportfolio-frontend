import { create } from 'zustand'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  signup: (email: string, password: string, name?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isLoading: false,
  isAuthenticated: false,

  signup: async (email: string, password: string, name?: string) => {
    set({ isLoading: true })
    try {
      const response = await apiClient.signup(email, password, name)
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      })
      apiClient.setToken(response.access_token)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await apiClient.login(email, password)
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      })
      apiClient.setToken(response.access_token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await apiClient.logout()
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true })
    try {
      const user = await apiClient.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      console.error('Get user failed:', error)
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  setToken: (token: string) => {
    set({ token })
    apiClient.setToken(token)
  },
}))

import { create } from 'zustand'
import { firebaseSignUp, firebaseSignIn, firebaseSignOut } from '@/lib/firebase'

interface User {
  id: string
  email: string
  name?: string
  created_at?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  signup: (email: string, password: string, name?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isLoading: false,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false,

  signup: async (email: string, password: string, name?: string) => {
    set({ isLoading: true })
    try {
      const { user, token } = await firebaseSignUp(email, password, name || '')

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_id', user.uid)
      }

      set({
        user: {
          id: user.uid,
          email: user.email || email,
          name: name,
        },
        token,
        isAuthenticated: true,
      })
    } catch (error: any) {
      console.error('Signup failed:', error)
      // Convert Firebase errors to readable messages
      const code = error.code || ''
      if (code === 'auth/email-already-in-use') throw new Error('Email already in use')
      if (code === 'auth/weak-password') throw new Error('Password is too weak (min 6 characters)')
      if (code === 'auth/invalid-email') throw new Error('Invalid email address')
      throw new Error(error.message || 'Sign up failed. Please try again.')
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { user, token } = await firebaseSignIn(email, password)

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_id', user.uid)
      }

      set({
        user: {
          id: user.uid,
          email: user.email || email,
        },
        token,
        isAuthenticated: true,
      })
    } catch (error: any) {
      console.error('Login failed:', error)
      const code = error.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password')
      }
      throw new Error(error.message || 'Login failed. Please try again.')
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await firebaseSignOut()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_id')
      }
      set({ user: null, token: null, isAuthenticated: false })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setToken: (token: string) => {
    set({ token })
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },
}))

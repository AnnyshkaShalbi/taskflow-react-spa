import { create } from 'zustand'
import type { User } from './types'

type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'

type AuthStore = {
  user: User | null
  token: string | null
  status: AuthStatus
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

const TOKEN_KEY = 'taskflow-token'

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  status: 'idle',

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ user, token, status: 'authenticated' })
  },

  setUser: (user) => {
    set({ user, status: 'authenticated' })
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, token: null, status: 'unauthenticated' })
  },
}))
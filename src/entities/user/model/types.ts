import type { ID } from '@/shared/types'

export type User = {
  id: ID
  email: string
  name: string
  avatarUrl?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type AuthResponse = {
  user: User
  token: string
}

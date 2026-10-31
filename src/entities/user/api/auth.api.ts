import { http } from '@/shared/api/http'
import type { AuthResponse, LoginInput, User } from '../model/types'

export const loginRequest = (input: LoginInput): Promise<AuthResponse> => {
  return http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export const meRequest = (token: string): Promise<User> => {
  return http<User>('/auth/me', { token })
}

export const logoutRequest = (token: string): Promise<void> => {
  return http<void>('/auth/logout', {
    method: 'POST',
    token,
  })
}
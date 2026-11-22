import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { loginRequest } from './auth.api'

/** Общий ключ: по нему форма и демо-вход знают, что вход уже идёт (useIsMutating) */
export const LOGIN_MUTATION_KEY = ['login'] as const

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: LOGIN_MUTATION_KEY,
    mutationFn: loginRequest,
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      queryClient.setQueryData(['me', token], user)
    },
  })
}
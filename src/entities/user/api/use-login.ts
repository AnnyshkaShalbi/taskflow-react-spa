import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { loginRequest } from './auth.api'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      queryClient.setQueryData(['me', token], user)
    },
  })
}
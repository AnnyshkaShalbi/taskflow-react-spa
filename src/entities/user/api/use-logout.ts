import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { logoutRequest } from './auth.api'

export function useLogout() {
  const token = useAuthStore((s) => s.token)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logoutRequest(token!),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { meRequest } from './auth.api'

export function useMe() {
  const token = useAuthStore((s) => s.token)
  const setUser = useAuthStore((s) => s.setUser)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const user = await meRequest(token!)
      setUser(user)
      return user
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    throwOnError: () => {
      clearAuth()
      return false
    },
  })
}
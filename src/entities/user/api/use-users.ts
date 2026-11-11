import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { http } from '@/shared/api/http'
import type { User } from '../model/types'

export function useUsers() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['users'],
    queryFn: () => http<User[]>('/users', { token: token! }),
    enabled: !!token,
  })
}
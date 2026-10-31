import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { habitsApi } from './habits.api'

export function useHabits() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['habits'],
    queryFn: () => habitsApi.getAll(token!),
    enabled: !!token,
  })
}
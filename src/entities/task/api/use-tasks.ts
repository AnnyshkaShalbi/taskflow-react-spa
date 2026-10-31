import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { tasksApi } from './tasks.api'

export function useTasks() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getAll(token!),
    enabled: !!token,
  })
}
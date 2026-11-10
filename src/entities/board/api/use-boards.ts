import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { boardsApi } from './boards.api'

export function useBoards() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => boardsApi.getAll(token!),
    enabled: !!token,
  })
}
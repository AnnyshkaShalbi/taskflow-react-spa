import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { commentsApi, commentsQueryKey } from './comments.api'

export function useComments(taskId: string) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: commentsQueryKey(taskId),
    queryFn: () => commentsApi.getByTask(taskId, token!),
    enabled: !!token,
  })
}

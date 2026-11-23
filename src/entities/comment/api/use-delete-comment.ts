import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { commentsApi, commentsQueryKey } from './comments.api'
import type { Comment } from '../model/types'

export function useDeleteComment(taskId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  const queryKey = commentsQueryKey(taskId)

  return useMutation({
    mutationFn: (id: string) => commentsApi.delete(id, token!),

    // Оптимистичное удаление с откатом при ошибке (например, 403 — чужой комментарий)
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Comment[]>(queryKey)
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) => old.filter((c) => c.id !== id))
      return { previous }
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

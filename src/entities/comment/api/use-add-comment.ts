import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { commentsApi, commentsQueryKey } from './comments.api'
import type { Comment } from '../model/types'

export function useAddComment(taskId: string) {
  const token = useAuthStore((s) => s.token)
  const currentUser = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const queryKey = commentsQueryKey(taskId)

  return useMutation({
    mutationFn: (text: string) => commentsApi.create(taskId, { text }, token!),

    // Оптимистично: комментарий появляется сразу, с пометкой isPending
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Comment[]>(queryKey)

      const optimistic: Comment = {
        id: `temp-${crypto.randomUUID()}`,
        taskId,
        authorId: currentUser!.id,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        isPending: true,
      }
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) => [...old, optimistic])

      return { previous, optimisticId: optimistic.id }
    },

    // Сервер подтвердил — подменяем временный комментарий настоящим
    onSuccess: (saved, _text, context) => {
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
        old.map((c) => (c.id === context?.optimisticId ? saved : c)),
      )
    },

    // Ошибка — откатываем
    onError: (_err, _text, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

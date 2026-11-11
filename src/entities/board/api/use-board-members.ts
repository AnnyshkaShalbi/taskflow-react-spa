import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { http, ApiError } from '@/shared/api/http' // <-- Импортируем ApiError
import type { Board } from '../model/types'

export function useInviteMember() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation<Board, ApiError, { boardId: string; email: string }>({
    mutationFn: ({ boardId, email }) => 
      http<Board>(`/boards/${boardId}/members`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        token: token!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}

export function useRemoveMember() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation<Board, ApiError, { boardId: string; userId: string }>({
    mutationFn: ({ boardId, userId }) => 
      http<Board>(`/boards/${boardId}/members/${userId}`, {
        method: 'DELETE',
        token: token!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { http } from '@/shared/api/http'
import type { Board } from '../model/types'

// Хук для приглашения
export function useInviteMember() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, email }: { boardId: string; email: string }) => 
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

// Хук для удаления участника
export function useRemoveMember() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, userId }: { boardId: string; userId: string }) => 
      http<Board>(`/boards/${boardId}/members/${userId}`, {
        method: 'DELETE',
        token: token!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { boardsApi } from './boards.api'
import type { CreateBoardInput } from '../model/types'

export function useCreateBoard() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBoardInput) => boardsApi.create(input, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
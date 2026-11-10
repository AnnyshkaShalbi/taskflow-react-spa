import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { boardsApi } from './boards.api'

export function useDeleteBoard() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => boardsApi.delete(id, token!),
    onSuccess: () => {
      // 1. Обновляем список досок (чтобы удаленная исчезла из сайдбара)
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      // 2. Обновляем список задач (так как задачи удаленной доски тоже стерлись)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
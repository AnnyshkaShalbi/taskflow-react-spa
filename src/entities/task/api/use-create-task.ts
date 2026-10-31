import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { tasksApi } from './tasks.api'
import type { CreateTaskInput } from '../model/types'

export function useCreateTask() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input, token!),
    onSuccess: () => {
      // Инвалидируем кэш: сообщаем TanStack Query, что данные устарели
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
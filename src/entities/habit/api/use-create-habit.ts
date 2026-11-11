import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { habitsApi } from './habits.api'
import type { CreateHabitInput } from '../model/types'

export function useCreateHabit() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateHabitInput) => habitsApi.create(input, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
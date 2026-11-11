import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { habitsApi } from './habits.api'
import type { CreateHabitInput } from '../model/types'

export function useUpdateHabit() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateHabitInput> }) => 
      habitsApi.update(id, input, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
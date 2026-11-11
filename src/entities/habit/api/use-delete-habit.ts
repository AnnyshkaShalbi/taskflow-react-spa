import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { habitsApi } from './habits.api'

export function useDeleteHabit() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => habitsApi.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
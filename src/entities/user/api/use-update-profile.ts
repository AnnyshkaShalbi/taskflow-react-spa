import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../model/store'
import { updateProfileRequest } from './auth.api'

export function useUpdateProfile() {
  const token = useAuthStore((s) => s.token)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { name: string }) => updateProfileRequest(input, token!),
    onSuccess: (updatedUser) => {
      // 1. Обновляем Zustand (чтобы имя в шапке изменилось мгновенно)
      setUser(updatedUser)
      
      // 2. Обновляем кэш TanStack Query (ключ ['me', token])
      queryClient.setQueryData(['me', token], updatedUser)
      
      // 3. Инвалидируем, чтобы на всякий случай синхронизироваться с сервером
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
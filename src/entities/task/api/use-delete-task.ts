import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { tasksApi } from './tasks.api'
import type { Task } from '../model/types'

export function useDeleteTask() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id, token!),

    // Оптимистичное удаление
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      // Ключи списков — ['tasks', boardId], поэтому работаем по префиксу
      const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] })

      // Мгновенно убираем задачу из кэша (и из UI)
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.filter((task) => task.id !== id)
      )

      return { previousTasks }
    },

    // Если сервер вернул ошибку — возвращаем задачу на место
    onError: (_err, _id, context) => {
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    // В любом случае синхронизируемся с сервером
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

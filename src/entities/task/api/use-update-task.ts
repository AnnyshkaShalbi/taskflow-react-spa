import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { tasksApi } from './tasks.api'
import type { Task, UpdateTaskInput } from '../model/types'

export function useUpdateTask() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.update(id, input, token!),

    // 1. Выполняется ДО запроса на сервер
    onMutate: async ({ id, input }) => {
      // Отменяем текущие запросы на refetch, чтобы они не перезаписали наш оптимистичный результат
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Сохраняем старое состояние кэша, чтобы откатить в случае ошибки
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Обновляем кэш руками (мгновенно меняем UI)
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) =>
          task.id === id ? { ...task, ...input } : task,
        ),
      )

      // Возвращаем старые данные контексту
      return { previousTasks }
    },

    // 2. Если сервер вернул ошибку (например, 500)
    onError: (_err, _newData, context) => {
      // Откатываем всё назад, используя сохранённые старые данные
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },

    // 3. Всегда — после успеха или ошибки
    onSettled: () => {
      // В фоне запрашиваем актуальные данные с сервера
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
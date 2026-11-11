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

      // Списки задач лежат под ключами ['tasks', boardId], поэтому работаем
      // со всеми запросами по префиксу, а не с точным ключом ['tasks']
      const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] })

      // Обновляем кэш руками (мгновенно меняем UI)
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
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
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    // 3. Всегда — после успеха или ошибки
    onSettled: () => {
      // В фоне запрашиваем актуальные данные с сервера
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

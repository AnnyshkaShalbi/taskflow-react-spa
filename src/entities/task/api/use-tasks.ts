import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user'
import { useBoardStore } from '@/entities/board'
import { tasksApi } from './tasks.api'

export function useTasks() {
  const token = useAuthStore((s) => s.token)
  const activeBoardId = useBoardStore((s) => s.activeBoardId)

  return useQuery({
    queryKey: ['tasks', activeBoardId], 
    queryFn: async () => {
      const allTasks = await tasksApi.getAll(token!)
      return allTasks.filter(t => t.boardId === activeBoardId)
    },
    enabled: !!token,
  })
}
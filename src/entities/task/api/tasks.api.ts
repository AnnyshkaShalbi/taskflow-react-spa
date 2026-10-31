import { http } from '@/shared/api/http'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../model/types'

export const tasksApi = {
  getAll: (token: string): Promise<Task[]> => {
    return http<Task[]>('/tasks', { token })
  },

  create: (input: CreateTaskInput, token: string): Promise<Task> => {
    return http<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
      token,
    })
  },

  update: (id: string, input: UpdateTaskInput, token: string): Promise<Task> => {
    return http<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
      token,
    })
  },

  delete: (id: string, token: string): Promise<void> => {
    return http<void>(`/tasks/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
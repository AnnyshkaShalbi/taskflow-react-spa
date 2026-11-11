import { http } from '@/shared/api/http'
import type { Habit, CreateHabitInput } from '../model/types'

export const habitsApi = {
  getAll: (token: string): Promise<Habit[]> => {
    return http<Habit[]>('/habits', { token })
  },

  create: (input: CreateHabitInput, token: string): Promise<Habit> => {
    return http<Habit>('/habits', {
      method: 'POST',
      body: JSON.stringify(input),
      token,
    })
  },

  toggle: (id: string, date: string, token: string): Promise<Habit> => {
    return http<Habit>(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ date }),
      token,
    })
  },

  update: (id: string, input: Partial<CreateHabitInput>, token: string): Promise<Habit> => {
    return http<Habit>(`/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
      token,
    })
  },

  delete: (id: string, token: string): Promise<void> => {
    return http<void>(`/habits/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}
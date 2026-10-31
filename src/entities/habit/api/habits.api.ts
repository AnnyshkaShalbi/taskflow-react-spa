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
}
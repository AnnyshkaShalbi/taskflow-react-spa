import type { ID, Timestamps } from '@/shared/types'

export type HabitFrequency = 'daily' | 'weekly'

export type Habit = Timestamps & {
  id: ID
  title: string
  description?: string
  frequency: HabitFrequency
  targetDays: number[] // 0 = воскресенье, 1 = понедельник, ... 6 = суббота
  color?: string // hex
  completedDates: string[] // массив ISO-дат ("2026-10-07")
}

export type CreateHabitInput = {
  title: string
  description?: string
  frequency: HabitFrequency
  targetDays: number[]
  color?: string
}

export type UpdateHabitInput = Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>

import { z } from 'zod'

export const habitFrequencySchema = z.enum(['daily', 'weekly'])

export const createHabitSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(80, 'Максимум 80 символов'),
  description: z.string().max(500).optional(),
  frequency: habitFrequencySchema,
  targetDays: z.array(z.number().min(0).max(6)).min(1, 'Выбери хотя бы один день'),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Неверный формат цвета')
    .optional(),
})

export type CreateHabitFormValues = z.infer<typeof createHabitSchema>

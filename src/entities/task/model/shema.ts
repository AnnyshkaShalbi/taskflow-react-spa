import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'in-progress', 'done'])
export const taskPrioritySchema = z.enum(['low', 'medium', 'high'])

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(120, 'Максимум 120 символов'),
  description: z.string().max(1000, 'Максимум 1000 символов').optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().datetime().optional(),
  boardId: z.string().min(1),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// Тип того, что приходит С СЕРВЕРА (с дефолтами)
export type CreateTaskFormValues = z.output<typeof createTaskSchema>

// Тип того, что мы заполняем В ФОРМЕ (где tags может отсутствовать)
export type CreateTaskInputValues = z.input<typeof createTaskSchema>
import { z } from 'zod'

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(60, 'Максимум 60 символов'),
  description: z.string().max(300, 'Максимум 300 символов').optional(),
  isPublic: z.boolean().optional(),
})

export type CreateBoardFormValues = z.infer<typeof createBoardSchema>

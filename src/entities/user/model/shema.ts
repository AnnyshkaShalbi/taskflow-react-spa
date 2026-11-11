import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

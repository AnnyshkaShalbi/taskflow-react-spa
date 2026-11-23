import { z } from 'zod'

export const COMMENT_MAX_LENGTH = 1000

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Комментарий не может быть пустым')
    .max(COMMENT_MAX_LENGTH, `Максимум ${COMMENT_MAX_LENGTH} символов`),
})

export type CommentFormValues = z.infer<typeof commentSchema>

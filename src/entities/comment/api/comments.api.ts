import { http } from '@/shared/api/http'
import type { Comment, CreateCommentInput } from '../model/types'

export const commentsApi = {
  getByTask: (taskId: string, token: string): Promise<Comment[]> =>
    http<Comment[]>(`/tasks/${taskId}/comments`, { token }),

  create: (taskId: string, input: CreateCommentInput, token: string): Promise<Comment> =>
    http<Comment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(input),
      token,
    }),

  delete: (id: string, token: string): Promise<void> =>
    http<void>(`/comments/${id}`, { method: 'DELETE', token }),
}

export const commentsQueryKey = (taskId: string) => ['comments', taskId] as const

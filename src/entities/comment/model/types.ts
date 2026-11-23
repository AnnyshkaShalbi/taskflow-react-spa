import type { ID } from '@/shared/types'

export type Comment = {
  id: ID
  taskId: ID
  authorId: ID
  text: string
  createdAt: string // ISO 8601
  /** Только на клиенте: комментарий добавлен оптимистично и ещё не подтверждён сервером */
  isPending?: boolean
}

export type CreateCommentInput = {
  text: string
}

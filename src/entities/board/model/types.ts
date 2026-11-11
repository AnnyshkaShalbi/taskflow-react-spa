import type { ID, Timestamps } from '@/shared/types'

export type Board = Timestamps & {
  id: ID
  title: string
  description?: string
  ownerId: ID
  memberIds: ID[]
  isPublic: boolean
}

export type CreateBoardInput = {
  title: string
  description?: string
  isPublic?: boolean
}

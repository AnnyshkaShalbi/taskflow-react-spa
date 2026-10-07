import type { ID, Timestamps } from '@/shared/types'

export type Board = Timestamps & {
  id: ID
  title: string
  description?: string
  ownerId: ID
  memberIds: ID[] // участники, с которыми поделились доской
  isPublic: boolean
}

export type CreateBoardInput = {
  title: string
  description?: string
  isPublic?: boolean
}

import type { ID, Timestamps } from '@/shared/types'

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = Timestamps & {
  id: ID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string // ISO 8601 дедлайн
  boardId: ID
  assigneeId?: ID
  tags: string[]
}

export type CreateTaskInput = Pick<Task, 'title' | 'status' | 'priority' | 'boardId'> & {
  description?: string
  dueDate?: string
  assigneeId?: ID
  tags?: string[]
}

export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>

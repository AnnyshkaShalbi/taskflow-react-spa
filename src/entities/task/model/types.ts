import type { ID, Timestamps } from '@/shared/types'

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = Timestamps & {
  id: ID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string // дедлайн, дата без времени: "YYYY-MM-DD"
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

// null у необязательных полей = «очистить» (undefined при JSON.stringify просто выпадает из запроса)
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assigneeId' | 'dueDate'>> & {
  assigneeId?: ID | null
  dueDate?: string | null
}

/** Применить патч к задаче: null-поля удаляются (так же делает сервер) */
export function applyTaskPatch(task: Task, patch: UpdateTaskInput): Task {
  const next: Record<string, unknown> = { ...task, ...patch }
  for (const key of Object.keys(next)) {
    if (next[key] === null) delete next[key]
  }
  return next as Task
}

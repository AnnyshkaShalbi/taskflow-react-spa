import type { TaskStatus } from './types'

/** Порядок статусов: так идут колонки на доске и пункты в селектах */
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

export const taskStatusLabels: Record<TaskStatus, string> = {
  'todo': 'К выполнению',
  'in-progress': 'В работе',
  'done': 'Готово',
}

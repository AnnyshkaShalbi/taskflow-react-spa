import type { TaskStatus } from './types'

/** Порядок статусов: так идут колонки на доске и пункты в селектах */
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

export const taskStatusLabels: Record<TaskStatus, string> = {
  'todo': 'К выполнению',
  'in-progress': 'В работе',
  'done': 'Готово',
}

/** Цвет точки-индикатора статуса (колонки канбана, табы, модалка задачи) */
export const taskStatusColors: Record<TaskStatus, string> = {
  'todo': 'bg-slate-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

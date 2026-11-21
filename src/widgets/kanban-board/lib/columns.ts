import type { TaskStatus } from '@/entities/task'

/** Цвет точки-индикатора колонки (в заголовке колонки и в табах) */
export const columnColors: Record<TaskStatus, string> = {
  'todo': 'bg-slate-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

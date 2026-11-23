import type { TaskPriority } from './types'

export const taskPriorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  'low': { label: 'Низкий', className: 'text-muted-foreground border-muted-foreground/30' },
  'medium': { label: 'Средний', className: 'text-amber-600 border-amber-600/30' },
  'high': { label: 'Высокий', className: 'text-red-600 border-red-600/30' },
}

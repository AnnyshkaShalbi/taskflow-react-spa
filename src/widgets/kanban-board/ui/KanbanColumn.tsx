import type { ReactNode } from 'react'
import type { TaskStatus } from '@/entities/task'
import { cn } from 'cn'

const columnConfig: Record<TaskStatus, { title: string; color: string }> = {
  'todo': { title: 'К выполнению', color: 'bg-slate-500' },
  'in-progress': { title: 'В работе', color: 'bg-blue-500' },
  'done': { title: 'Готово', color: 'bg-green-500' },
}

type KanbanColumnProps = {
  status: TaskStatus
  count: number
  children: ReactNode
}

export function KanbanColumn({ status, count, children }: KanbanColumnProps) {
  const config = columnConfig[status]

  return (
    <div className="flex flex-col bg-muted/30 rounded-xl border border-dashed min-h-[500px] w-full max-w-sm">
      {/* Заголовок колонки */}
      <div className="flex items-center justify-between p-3 border-b bg-background rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', config.color)} />
          <h3 className="font-semibold text-sm">{config.title}</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Список карточек */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
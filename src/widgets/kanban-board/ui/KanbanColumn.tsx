import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
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
  const { setNodeRef, isOver } = useDroppable({
    id: status, // В качестве id используем сам статус ('todo', 'done')
  })
  const config = columnConfig[status]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-muted/30 rounded-xl border border-dashed min-h-125 w-full max-w-sm transition-colors',
        isOver && 'bg-primary/5 border-primary/50 ring-2 ring-primary/20' // Подсветка при наведении
      )}
    >
      <div className="flex items-center justify-between p-3 border-b bg-background rounded-t-xl pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', config.color)} />
          <h3 className="font-semibold text-sm">{config.title}</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
import { useDraggable } from '@dnd-kit/core'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Task, TaskPriority } from '@/entities/task'
import { cn } from 'cn'

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

type KanbanCardProps = {
  task: Task
  isOverlay?: boolean
}

export function KanbanCard({ task, isOverlay = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled: isOverlay,
  })

  const dragProps = isOverlay ? {} : { ref: setNodeRef, ...listeners, ...attributes }

  return (
    <Card
      {...dragProps}
      className={cn(
        'p-3 cursor-grab bg-card touch-none select-none transition-shadow hover:shadow-md',
        isDragging && 'opacity-30',
        isOverlay && [
          'cursor-grabbing rotate-2 scale-[1.03] shadow-2xl ring-2 ring-primary/20',
          'transition-[rotate,scale,box-shadow] duration-250 ease-out',
          'in-[.kanban-dropping]:rotate-0 in-[.kanban-dropping]:scale-100 in-[.kanban-dropping]:shadow-sm',
        ],
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2 pointer-events-none">
        <p className="text-sm font-medium leading-tight">{task.title}</p>
        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 shrink-0', priorityColors[task.priority])}>
          {task.priority}
        </Badge>
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pointer-events-none">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] text-muted-foreground">#{tag}</span>
          ))}
        </div>
      )}
    </Card>
  )
}

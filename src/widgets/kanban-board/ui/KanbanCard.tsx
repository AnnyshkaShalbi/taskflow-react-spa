import { useDraggable } from '@dnd-kit/core'
import { MoreHorizontal } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Task, TaskPriority, TaskStatus } from '@/entities/task'
import { cn } from 'cn'
import { KanbanCardMenu } from './KanbanCardMenu'

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

type KanbanCardProps = {
  task: Task
  isOverlay?: boolean
  /** Только для overlay: карточку держат над табом */
  isOverTab?: boolean
  onMove?: (status: TaskStatus) => void
}

export function KanbanCard({ task, isOverlay = false, isOverTab = false, onMove }: KanbanCardProps) {
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
        // Отступы — как у карточек статистики на dashboard: 12px / 16px с sm, между строками 8px / 12px
        // (px задаём явно: у Card только py, горизонтальный отступ обычно дают CardHeader/CardContent)
        'px-(--card-spacing) gap-2 [--card-spacing:--spacing(3)] sm:gap-3 sm:[--card-spacing:--spacing(4)]',
        'cursor-grab bg-card touch-manipulation select-none [-webkit-touch-callout:none] transition-shadow hover:shadow-md',
        isDragging && 'opacity-30',
        isOverlay && [
          'cursor-grabbing rotate-2 scale-[1.03] shadow-2xl ring-2 ring-primary/20',
          'transition-[rotate,scale,box-shadow,opacity] duration-250 ease-out',
          'in-[.kanban-dropping]:rotate-0 in-[.kanban-dropping]:scale-100 in-[.kanban-dropping]:shadow-sm',
          // Над табом карточка «уступает» цели: меньше и полупрозрачная
          isOverTab && 'scale-90 opacity-50 shadow-md',
        ],
      )}
    >
      <div className="flex items-start gap-2 pointer-events-none">
        <p className="flex-1 min-w-0 wrap-break-word text-sm font-medium leading-tight">{task.title}</p>
        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 shrink-0', priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        {isOverlay ? (
          // В «летящей» копии меню не нужно — рисуем такую же иконку, чтобы карточка не прыгала по ширине
          <span className="-my-1 -mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground pointer-fine:opacity-0">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          onMove && <KanbanCardMenu status={task.status} onMove={onMove} />
        )}
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pointer-events-none">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] text-muted-foreground">#{tag}</span>
          ))}
        </div>
      )}
    </Card>
  )
}

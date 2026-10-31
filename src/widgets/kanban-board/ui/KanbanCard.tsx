import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Task, TaskPriority } from '@/entities/task'
import { cn } from 'cn'

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function KanbanCard({ task, isOverlay = false }: { task: Task; isOverlay?: boolean }) {
  const draggable = useDraggable({
    id: task.id,
    data: { task },
    disabled: isOverlay, 
  })

  const { attributes, listeners, setNodeRef, transform, isDragging } = draggable

  const style = !isOverlay && transform ? {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1, 
  } : undefined

  return (
    <Card
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(!isOverlay ? listeners : {})}
      {...(!isOverlay ? attributes : {})}
      className={cn(
        // Базовые стили + плавное появление (animate-in fade-in zoom-in)
        'p-3 cursor-grab active:cursor-grabbing hover:shadow-md bg-card touch-none animate-in fade-in zoom-in-95 duration-200',
        isDragging && 'opacity-30',
        // Стили для летящего оверлея (наклон и тень)
        isOverlay && 'shadow-2xl rotate-3 scale-105 cursor-grabbing ring-2 ring-primary/20'
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
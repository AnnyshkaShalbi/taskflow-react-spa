import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Task, TaskPriority } from '@/entities/task'
import { cn } from 'cn'

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function KanbanCard({ task }: { task: Task }) {
  return (
    <Card className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="text-sm font-medium leading-tight">{task.title}</p>
        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 shrink-0', priorityColors[task.priority])}>
          {task.priority}
        </Badge>
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] text-muted-foreground">#{tag}</span>
          ))}
        </div>
      )}
    </Card>
  )
}
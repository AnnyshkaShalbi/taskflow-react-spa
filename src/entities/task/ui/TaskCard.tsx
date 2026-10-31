import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from 'cn'
import { StatusSelect } from './StatusSelect'
import type { Task, TaskPriority } from '../model/types'

type TaskCardProps = {
  task: Task
  className?: string
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  'low': { label: 'Низкий', className: 'text-muted-foreground border-muted-foreground/30' },
  'medium': { label: 'Средний', className: 'text-amber-600 border-amber-600/30' },
  'high': { label: 'Высокий', className: 'text-red-600 border-red-600/30' },
}

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Card className={cn('flex flex-col hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {task.title}
          </CardTitle>
          <Badge variant="outline" className={cn('shrink-0', priorityConfig[task.priority].className)}>
            {priorityConfig[task.priority].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end gap-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <StatusSelect task={task} />
          
          {task.tags.length > 0 && (
            <div className="flex gap-1 overflow-hidden">
              {task.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">+{task.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
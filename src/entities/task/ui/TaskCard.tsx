import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from 'cn'
import { StatusSelect } from './StatusSelect'
import type { ReactNode } from 'react'

import type { Task, TaskPriority } from '../model/types'

type TaskCardProps = {
  task: Task
  className?: string
  actions?: ReactNode
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  'low': { label: 'Низкий', className: 'text-muted-foreground border-muted-foreground/30' },
  'medium': { label: 'Средний', className: 'text-amber-600 border-amber-600/30' },
  'high': { label: 'Высокий', className: 'text-red-600 border-red-600/30' },
}

export function TaskCard({ task, className, actions }: TaskCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3 hover:shadow-md transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start gap-2">
          <CardTitle className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base font-semibold leading-snug">
            {task.title}
          </CardTitle>
          <Badge variant="outline" className={cn('shrink-0', priorityConfig[task.priority].className)}>
            {priorityConfig[task.priority].label}
          </Badge>
          {actions}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end gap-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-2">
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
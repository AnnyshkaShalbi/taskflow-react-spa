import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from 'cn'
import { StatusSelect } from './StatusSelect'
import type { ReactNode } from 'react'

import type { Task } from '../model/types'
import { taskPriorityConfig } from '../model/priority'

type TaskCardProps = {
  task: Task
  className?: string
  actions?: ReactNode
  /** Если передан — карточка кликабельна (открыть подробный просмотр) */
  onOpen?: () => void
}

export function TaskCard({ task, className, actions, onOpen }: TaskCardProps) {
  const priority = taskPriorityConfig[task.priority]

  return (
    <Card
      className={cn(
        'relative flex flex-col gap-3 hover:shadow-md transition-shadow',
        onOpen && 'cursor-pointer hover:ring-foreground/20',
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-2">
          <CardTitle className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base font-semibold leading-snug">
            {onOpen ? (
              // «Растянутая» кнопка: её ::after покрывает всю карточку — клик в любом месте открывает
              // задачу, а с клавиатуры карточка доступна через Tab + Enter.
              // Интерактивные элементы (статус, удаление) подняты над этим слоем через relative z-10.
              <button
                type="button"
                onClick={onOpen}
                className={cn(
                  'text-left outline-none',
                  "after:absolute after:inset-0 after:rounded-xl after:content-['']",
                  'focus-visible:after:ring-2 focus-visible:after:ring-ring/50',
                )}
              >
                {task.title}
              </button>
            ) : (
              task.title
            )}
          </CardTitle>
          <Badge variant="outline" className={cn('shrink-0', priority.className)}>
            {priority.label}
          </Badge>
          {actions && <div className="relative z-10 shrink-0">{actions}</div>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end gap-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative z-10">
            <StatusSelect task={task} />
          </div>

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

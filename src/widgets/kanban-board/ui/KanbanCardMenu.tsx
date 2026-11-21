import type { SyntheticEvent } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { TASK_STATUSES, taskStatusLabels, type TaskStatus } from '@/entities/task'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn } from 'cn'
import { columnColors } from '../lib/columns'

type KanbanCardMenuProps = {
  status: TaskStatus
  onMove: (status: TaskStatus) => void
}

// Карточка целиком — drag-хэндл. Гасим всплытие, чтобы нажатие (в т.ч. долгое) на кнопку
// не запускало перетаскивание.
const stop = (e: SyntheticEvent) => e.stopPropagation()

export function KanbanCardMenu({ status, onMove }: KanbanCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onMouseDown={stop}
        onTouchStart={stop}
        onKeyDown={stop}
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Сменить статус"
            className={cn(
              'pointer-events-auto -my-1 -mr-1.5 h-7 w-7 shrink-0 text-muted-foreground',
              // На устройствах с мышью кнопка появляется при наведении на карточку,
              // на тач-устройствах видна всегда (hover там нет)
              'pointer-fine:opacity-0 pointer-fine:group-hover/card:opacity-100',
              'focus-visible:opacity-100 data-popup-open:opacity-100',
            )}
          />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Переместить в</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(value) => onMove(value as TaskStatus)}
          >
            {TASK_STATUSES.map((s) => (
              <DropdownMenuRadioItem key={s} value={s} className="gap-2 pointer-coarse:py-2.5">
                <span className={cn('h-2 w-2 rounded-full', columnColors[s])} />
                {taskStatusLabels[s]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { taskStatusLabels, type TaskStatus } from '@/entities/task'
import { cn } from 'cn'
import { columnColors } from '../lib/columns'

type KanbanColumnProps = {
  status: TaskStatus
  count: number
  children: ReactNode
  /** DOM-узел колонки нужен доске, чтобы прокручивать к ней ленту по тапу на таб */
  columnRef?: (el: HTMLDivElement | null) => void
}

export function KanbanColumn({ status, count, children, columnRef }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status, // В качестве id используем сам статус ('todo', 'done')
    data: { status }, // статус цели доска читает из data — одинаково для колонок и табов
  })

  return (
    <div
      ref={(el) => {
        setNodeRef(el)
        columnRef?.(el)
      }}
      className={cn(
        'flex flex-col bg-muted/30 rounded-xl border border-dashed transition-colors',
        // < xl: колонка в горизонтальной ленте со снапом; xl+: ячейка сетки
        'w-[min(85vw,20rem)] shrink-0 snap-start min-h-72 sm:min-h-96 xl:w-auto xl:min-h-125',
        isOver && 'bg-primary/5 border-primary/50 ring-2 ring-primary/20' // Подсветка при наведении
      )}
    >
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background rounded-t-xl pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', columnColors[status])} />
          <h3 className="font-semibold text-sm">{taskStatusLabels[status]}</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

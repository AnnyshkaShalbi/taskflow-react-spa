import { useDroppable } from '@dnd-kit/core'
import { TASK_STATUSES, taskStatusLabels, type TaskStatus } from '@/entities/task'
import { cn } from 'cn'
import { columnColors } from '../lib/columns'
import { tabDroppableId } from '../lib/collision'
import { DRAG_OVERLAY_Z_INDEX } from '../lib/z-index'

type KanbanTabsProps = {
  active: TaskStatus
  counts: Record<TaskStatus, number>
  onSelect: (status: TaskStatus) => void
  /** Идёт перетаскивание — табы превращаются в цели для drop */
  isDragging: boolean
}

/**
 * Навигация по колонкам для мобилки/планшета (< xl), где колонки идут лентой.
 * Прилипает под шапкой: на мобилке шапка sticky (h-14), с md — нет.
 * Во время drag на таб можно бросить карточку — не нужно тянуть её до дальней колонки.
 */
export function KanbanTabs({ active, counts, onSelect, isDragging }: KanbanTabsProps) {
  return (
    <div
      className={cn(
        'xl:hidden sticky top-14 md:top-0 z-20 bg-background/80 backdrop-blur-md',
        // -mt-2 компенсирует py-2: сам переключатель стоит ровно на шаге секций от заголовка (24 / 32px),
        // а до ленты колонок — шаг сетки (12 / 16px)
        '-mx-4 px-4 sm:-mx-6 sm:px-6 py-2 -mt-2 mb-1 sm:mb-2',
      )}
      // Во время drag панель поднимаем над «летящей» карточкой: карточка уходит под размытую
      // панель, а табы-цели остаются видны
      style={isDragging ? { zIndex: DRAG_OVERLAY_Z_INDEX + 1 } : undefined}
    >
      <div
        role="tablist"
        aria-label="Колонки доски"
        className={cn(
          'flex gap-1 rounded-lg bg-muted p-1 transition-shadow',
          isDragging && 'ring-2 ring-primary/30',
        )}
      >
        {TASK_STATUSES.map((status) => (
          <KanbanTab
            key={status}
            status={status}
            count={counts[status]}
            isActive={status === active}
            isDragging={isDragging}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

type KanbanTabProps = {
  status: TaskStatus
  count: number
  isActive: boolean
  isDragging: boolean
  onSelect: (status: TaskStatus) => void
}

function KanbanTab({ status, count, isActive, isDragging, onSelect }: KanbanTabProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: tabDroppableId(status),
    data: { status },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(status)}
      className={cn(
        // border всегда есть (прозрачный), чтобы при начале drag табы не «прыгали» на 1px
        'flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1.5',
        'text-xs sm:text-sm font-medium transition-all',
        isActive && !isDragging
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        // Во время drag все табы выглядят как «зоны сброса», а таб под пальцем — подсвечен
        isDragging && 'border-dashed border-muted-foreground/30',
        isOver && 'scale-105 border-solid border-primary bg-primary/10 text-foreground',
      )}
    >
      <span className={cn('hidden sm:block h-2 w-2 shrink-0 rounded-full', columnColors[status])} />
      <span className="truncate">{taskStatusLabels[status]}</span>
      <span
        className={cn(
          // Высота = мин. ширина → круг для 1 цифры, аккуратная «пилюля» для 2+
          'inline-flex shrink-0 items-center justify-center rounded-full tabular-nums leading-none',
          'h-4.5 min-w-4.5 px-1 text-[10px] sm:h-5 sm:min-w-5 sm:text-xs',
          isActive ? 'bg-muted' : 'bg-background/60',
        )}
      >
        {count}
      </span>
    </button>
  )
}

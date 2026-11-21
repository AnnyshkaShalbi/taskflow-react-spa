import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation
} from '@dnd-kit/core'
import { TASK_STATUSES, useTasks, useUpdateTask } from '@/entities/task'
import type { Task, TaskStatus } from '@/entities/task'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { KanbanTabs } from './KanbanTabs'
import { DRAG_OVERLAY_Z_INDEX } from '../lib/z-index'
import { Skeleton } from '@/shared/ui/skeleton'
import { hapticTap, isTouchEvent } from '@/shared/lib/haptics'
import { useKanbanSensors } from '../lib/sensors'
import { isTabDroppable, kanbanCollisionDetection } from '../lib/collision'
import { cn } from 'cn'

// < xl: горизонтальная лента колонок со снапом, «в край» экрана (компенсируем паддинг страницы);
// xl+: колонки сеткой 3 в ряд
const boardLayoutClass = cn(
  'flex gap-3 sm:gap-4 overflow-x-auto pb-4 items-start',
  '-mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6',
  'xl:grid xl:grid-cols-3 xl:mx-0 xl:px-0 xl:overflow-visible',
)

const dropAnimationConfig: DropAnimation = {
  duration: 250,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0' } },
    className: { dragOverlay: 'kanban-dropping' },
  }),
}

export function KanbanBoard() {
  const { data: tasks, isLoading } = useTasks()
  const { mutateAsync: updateTask } = useUpdateTask()
  const sensors = useKanbanSensors()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  // Карточку держат над табом — «летящая» копия становится полупрозрачной, чтобы не закрывать цель
  const [isOverTab, setIsOverTab] = useState(false)
  const [pendingMoves, setPendingMoves] = useState<Record<string, TaskStatus>>({})

  // Табы ↔ лента колонок
  const [visibleColumn, setVisibleColumn] = useState<TaskStatus>(TASK_STATUSES[0])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<Partial<Record<TaskStatus, HTMLDivElement | null>>>({})
  // Перетаскивание начато пальцем — для тактильных откликов
  const isTouchDragRef = useRef(false)
  // Идёт плавная прокрутка по тапу на таб — пока она не закончится, onScroll не трогает активный таб,
  // иначе по пути он «перепрыгивает» через промежуточные колонки и мигает
  const isProgrammaticScrollRef = useRef(false)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(scrollEndTimerRef.current), [])

  const boardTasks = useMemo(
    () => (tasks ?? []).map(task =>
      task.id in pendingMoves ? { ...task, status: pendingMoves[task.id] } : task,
    ),
    [tasks, pendingMoves],
  )

  const tasksByStatus = useMemo(() => {
    const groups = Object.fromEntries(TASK_STATUSES.map(s => [s, [] as Task[]])) as Record<TaskStatus, Task[]>
    boardTasks.forEach(task => groups[task.status].push(task))
    return groups
  }, [boardTasks])

  if (isLoading) {
    return (
      <div className={boardLayoutClass}>
        {TASK_STATUSES.map(col => (
          <div key={col} className="w-[min(85vw,20rem)] shrink-0 space-y-2 xl:w-auto">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    )
  }

  const settleMove = (taskId: string, status: TaskStatus) => {
    setPendingMoves(prev => {
      if (prev[taskId] !== status) return prev
      const next = { ...prev }
      delete next[taskId]
      return next
    })
  }

  /** Общая логика смены статуса — и для drag & drop, и для меню на карточке */
  const moveTask = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return

    setPendingMoves(prev => ({ ...prev, [task.id]: newStatus }))

    updateTask({ id: task.id, input: { status: newStatus } })
      .catch(() => {}) // ошибка обработана откатом в useUpdateTask
      .finally(() => settleMove(task.id, newStatus))
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task as Task)
    // Карточку «взяли» долгим нажатием — подтверждаем лёгкой вибрацией (только для тача)
    isTouchDragRef.current = isTouchEvent(event.activatorEvent)
    if (isTouchDragRef.current) hapticTap()
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Палец заехал на таб — короткий «щелчок», чтобы было понятно, что сюда можно бросить
    const overTab = !!event.over && isTabDroppable(event.over.id)
    setIsOverTab(overTab)
    if (isTouchDragRef.current && overTab) hapticTap(5)
  }

  const resetDrag = () => {
    setActiveTask(null)
    setIsOverTab(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    resetDrag()

    const task = event.active.data.current?.task as Task | undefined
    // Статус цели лежит в data и у колонок, и у табов
    const newStatus = event.over?.data.current?.status as TaskStatus | undefined
    if (!task || !newStatus) return

    moveTask(task, newStatus)
  }

  /** Тап по табу — плавно прокручиваем ленту к колонке */
  const scrollToColumn = (status: TaskStatus) => {
    const scroller = scrollerRef.current
    const column = columnRefs.current[status]
    const first = columnRefs.current[TASK_STATUSES[0]]
    if (!scroller || !column || !first) return

    setVisibleColumn(status)
    isProgrammaticScrollRef.current = true
    scheduleScrollEnd() // на случай, если лента уже на месте и событий scroll не будет
    scroller.scrollTo({ left: column.offsetLeft - first.offsetLeft, behavior: 'smooth' })
  }

  /**
   * «Конец прокрутки» = 120 мс без событий scroll. Не используем событие scrollend:
   * его поддерживают ещё не все браузеры (Safari).
   */
  const scheduleScrollEnd = () => {
    clearTimeout(scrollEndTimerRef.current)
    scrollEndTimerRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false
      syncVisibleColumn()
    }, 120)
  }

  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) {
      scheduleScrollEnd()
      return
    }
    syncVisibleColumn()
  }

  /** Подсвечиваем таб той колонки, что сейчас у левого края ленты */
  const syncVisibleColumn = () => {
    const scroller = scrollerRef.current
    const first = columnRefs.current[TASK_STATUSES[0]]
    if (!scroller || !first) return

    const isAtEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1
    if (isAtEnd) {
      setVisibleColumn(TASK_STATUSES[TASK_STATUSES.length - 1])
      return
    }

    let closest: TaskStatus = TASK_STATUSES[0]
    let minDistance = Infinity
    for (const status of TASK_STATUSES) {
      const column = columnRefs.current[status]
      if (!column) continue
      const distance = Math.abs(column.offsetLeft - first.offsetLeft - scroller.scrollLeft)
      if (distance < minDistance) {
        minDistance = distance
        closest = status
      }
    }
    setVisibleColumn(closest)
  }

  const counts = Object.fromEntries(
    TASK_STATUSES.map(s => [s, tasksByStatus[s].length]),
  ) as Record<TaskStatus, number>

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={kanbanCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={resetDrag}
    >
      <KanbanTabs
        active={visibleColumn}
        counts={counts}
        onSelect={scrollToColumn}
        isDragging={activeTask !== null}
      />

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className={cn(
          boardLayoutClass,
          // во время drag снап выключаем, иначе он мешает автоскроллу к соседней колонке
          activeTask ? 'snap-none' : 'snap-x snap-mandatory',
        )}
      >
        {TASK_STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            count={counts[status]}
            columnRef={(el) => { columnRefs.current[status] = el }}
          >
            {tasksByStatus[status].map(task => (
              <KanbanCard
                key={task.id}
                task={task}
                onMove={(newStatus) => moveTask(task, newStatus)}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>

      {createPortal(
        <DragOverlay
          style={{ zIndex: DRAG_OVERLAY_Z_INDEX }}
          dropAnimation={dropAnimationConfig}
        >
          {activeTask ? <KanbanCard task={activeTask} isOverlay isOverTab={isOverTab} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}

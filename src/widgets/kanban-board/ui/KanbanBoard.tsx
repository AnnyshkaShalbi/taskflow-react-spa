import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation
} from '@dnd-kit/core'
import { useTasks, useUpdateTask } from '@/entities/task'
import type { Task, TaskStatus } from '@/entities/task'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { Skeleton } from '@/shared/ui/skeleton'
import { useKanbanSensors } from '../lib/sensors'

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done']

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
  const [pendingMoves, setPendingMoves] = useState<Record<string, TaskStatus>>({})

  const boardTasks = useMemo(
    () => (tasks ?? []).map(task =>
      task.id in pendingMoves ? { ...task, status: pendingMoves[task.id] } : task,
    ),
    [tasks, pendingMoves],
  )

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col} className="w-full max-w-sm space-y-2">
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task as Task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)

    const task = event.active.data.current?.task as Task | undefined
    const newStatus = event.over?.id as TaskStatus | undefined
    if (!task || !newStatus || task.status === newStatus) return

    setPendingMoves(prev => ({ ...prev, [task.id]: newStatus }))

    updateTask({ id: task.id, input: { status: newStatus } })
      .catch(() => {}) // ошибка обработана откатом в useUpdateTask
      .finally(() => settleMove(task.id, newStatus))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 items-start h-full">
        {COLUMNS.map(status => {
          const columnTasks = boardTasks.filter(t => t.status === status)

          return (
            <KanbanColumn key={status} status={status} count={columnTasks.length}>
              {columnTasks.map(task => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
          )
        })}
      </div>

      {createPortal(
        <DragOverlay
          style={{ zIndex: 9999 }}
          dropAnimation={dropAnimationConfig}
        >
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}

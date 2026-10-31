import { useState } from 'react'
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

// Настраиваем быструю и упругую анимацию падения
const dropAnimationConfig: DropAnimation = {
  duration: 200, // 200мс — золотой стандарт, кажется мгновенным, но плавным
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)', // Легкий отскок (пружина)
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5', // Оригинал на доске будет слегка прозрачным в момент падения
      },
    },
  }),
}

export function KanbanBoard() {
  const { data: tasks, isLoading } = useTasks()
  const { mutate: updateTask } = useUpdateTask()
  const sensors = useKanbanSensors()
  
  const [activeTask, setActiveTask] = useState<Task | null>(null)

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

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task
    setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // СРАЗУ сбрасываем оверлей, чтобы анимация падения началась моментально
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus
    
    const task = tasks?.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Оптимистичное обновление перекинет карточку в новую колонку под капотом
    updateTask({
      id: taskId,
      input: { status: newStatus }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 items-start h-full">
        {COLUMNS.map(status => {
          const columnTasks = tasks?.filter(t => t.status === status) ?? []
          
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
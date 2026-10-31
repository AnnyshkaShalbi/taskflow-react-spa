import { useTasks } from '@/entities/task'
import type { TaskStatus } from '@/entities/task'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { Skeleton } from '@/shared/ui/skeleton'

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done']

export function KanbanBoard() {
  const { data: tasks, isLoading } = useTasks()

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

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
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
  )
}
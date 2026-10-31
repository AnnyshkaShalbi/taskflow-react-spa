import { useTasks, TaskCard } from '@/entities/task'
import { Skeleton } from '@/shared/ui/skeleton'
import { ClipboardList } from 'lucide-react'

export function TaskList() {
  const { data: tasks, isLoading, isError } = useTasks()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed text-destructive">
        Не удалось загрузить задачи. Попробуйте обновить страницу.
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed flex flex-col items-center gap-3">
        <div className="bg-muted p-4 rounded-full">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Нет задач</p>
          <p className="text-sm text-muted-foreground">Создайте первую задачу, чтобы начать работу</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
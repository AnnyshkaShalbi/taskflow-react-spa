import { useState } from 'react'
import { useTasks, TaskCard } from '@/entities/task'
import { Skeleton } from '@/shared/ui/skeleton'
import { ClipboardList } from 'lucide-react'
import { DeleteTaskButton } from '@/features/delete-task'
import { TaskDetailsDialog } from './TaskDetailsDialog'

// Как в списке привычек: колонки по реальной ширине контента — с md появляется сайдбар (224px),
// и 2 колонки на 768–1023px / 3 колонки на 1024–1279px дают слишком узкие карточки
const gridClass = 'grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'

export function TaskList() {
  const { data: tasks, isLoading, isError } = useTasks()
  // Храним id, а не саму задачу: модалка берёт актуальные данные из кэша — если статус поменяли
  // (или задачу удалили), она сразу это отражает / закрывается
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const openTask = tasks?.find((t) => t.id === openTaskId) ?? null

  if (isLoading) {
    return (
      <div className={gridClass}>
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
    <>
      <div className={gridClass}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            actions={<DeleteTaskButton taskId={task.id} />}
            onOpen={() => setOpenTaskId(task.id)}
          />
        ))}
      </div>

      <TaskDetailsDialog
        task={openTask}
        onOpenChange={(open) => !open && setOpenTaskId(null)}
      />
    </>
  )
}
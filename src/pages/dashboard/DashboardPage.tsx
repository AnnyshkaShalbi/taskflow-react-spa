import { TaskList } from '@/widgets/task-list'
import { CreateTaskDialog } from '@/features/create-task'

export function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои задачи</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте своими задачами и отслеживайте прогресс.
          </p>
        </div>
        {/* Вот она — наша кнопка создания! */}
        <CreateTaskDialog />
      </div>

      <TaskList />
    </div>
  )
}
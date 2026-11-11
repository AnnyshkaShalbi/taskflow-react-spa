import { TaskList } from '@/widgets/task-list'
import { CreateTaskDialog } from '@/features/create-task'
import { DashboardStats } from '@/widgets/dashboard-stats'
import { TaskActivityChart } from '@/widgets/task-activity-chart'
import { BoardMembers } from '@/widgets/board-members' // <-- Импорт

export function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Шапка */}
      <div className="flex justify-between items-start"> {/* Изменили на items-start */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Обзор</h1>
            <p className="text-muted-foreground mt-1">
              Ваша статистика и последние задачи.
            </p>
          </div>
          {/* Добавили виджет с участниками */}
          <BoardMembers />
        </div>
        <CreateTaskDialog />
      </div>

      <DashboardStats />
      <TaskActivityChart />

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Последние задачи</h2>
        <TaskList />
      </div>
    </div>
  )
}
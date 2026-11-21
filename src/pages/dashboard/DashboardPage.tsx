import { TaskList } from '@/widgets/task-list'
import { CreateTaskDialog } from '@/features/create-task'
import { DashboardStats } from '@/widgets/dashboard-stats'
import { TaskActivityChart } from '@/widgets/task-activity-chart'
import { BoardMembers } from '@/widgets/board-members'

export function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Шапка: на мобилке — колонкой, с sm — заголовок слева, кнопка справа */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Обзор</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Ваша статистика и последние задачи.
            </p>
          </div>
          <BoardMembers />
        </div>
        <CreateTaskDialog triggerClassName="w-full sm:w-auto" />
      </div>

      <DashboardStats />
      <TaskActivityChart />

      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-3 sm:mb-4">Последние задачи</h2>
        <TaskList />
      </div>
    </div>
  )
}
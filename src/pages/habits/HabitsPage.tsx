import { HabitList } from '@/widgets/habit-list'
import { CreateHabitDialog } from '@/features/create-habit'

export function HabitsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Шапка: на мобилке — колонкой, с sm — заголовок слева, кнопка справа (как на dashboard) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Мои привычки</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Отмечайте выполнение и следите за своими сериями (стриками).
          </p>
        </div>
        
        <CreateHabitDialog triggerClassName="w-full sm:w-auto" />
      </div>

      <HabitList />
    </div>
  )
}
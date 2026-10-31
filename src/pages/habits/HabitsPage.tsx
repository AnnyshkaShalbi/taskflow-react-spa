import { HabitList } from '@/widgets/habit-list'

export function HabitsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои привычки</h1>
          <p className="text-muted-foreground mt-1">
            Отмечайте выполнение и следите за своими сериями (стриками).
          </p>
        </div>
        {/* Сюда мы добавим кнопку создания в следующем шаге */}
      </div>

      <HabitList />
    </div>
  )
}
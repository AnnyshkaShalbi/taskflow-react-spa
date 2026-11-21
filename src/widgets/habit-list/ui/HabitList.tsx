import { useHabits, HabitCard } from '@/entities/habit'
import { Skeleton } from '@/shared/ui/skeleton'
import { ClipboardCheck } from 'lucide-react'

// Колонки подобраны по реальной ширине контента: с md появляется сайдбар (224px),
// и 2 колонки на 768–1023px / 3 колонки на 1024–1279px дают слишком узкие карточки
const gridClass = 'grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'

export function HabitList() {
  const { data: habits, isLoading, isError } = useHabits()

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3 sm:space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 justify-between">
              {Array.from({ length: 7 }).map((_, j) => <Skeleton key={j} className="h-7 w-7 rounded-full" />)}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <div className="text-destructive text-center py-8">Ошибка загрузки привычек</div>
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed flex flex-col items-center gap-3">
        <div className="bg-muted p-4 rounded-full">
          <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium">У вас пока нет привычек</p>
        <p className="text-sm text-muted-foreground">Создайте первую привычку, чтобы начать отслеживать прогресс</p>
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Check, Flame } from 'lucide-react'
import { cn } from 'cn'
import type { Habit } from '../model/types'
import { useToggleHabit } from '../api/use-toggle-habit'
import { getTodayString, calculateStreak } from '@/shared/lib/date'

const WEEK_DAYS = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 0 },
]

export function HabitCard({ habit }: { habit: Habit }) {
  const { mutate: toggleHabit, isPending } = useToggleHabit()
  
  const todayStr = getTodayString()
  const isCompletedToday = habit.completedDates.includes(todayStr)
  const streak = calculateStreak(habit.completedDates)

  const handleToggle = () => {
    toggleHabit({ id: habit.id, date: todayStr })
  }

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">{habit.title}</CardTitle>
            {habit.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{habit.description}</p>
            )}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full text-sm">
              <Flame className="h-4 w-4" />
              {streak}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end gap-4 mt-2">
        {/* Дни недели */}
        <div className="flex justify-between items-center px-1">
          {WEEK_DAYS.map((day) => {
            const isTarget = habit.targetDays.includes(day.value)
            return (
              <div 
                key={day.value}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                  isTarget 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground/40"
                )}
              >
                {day.label}
              </div>
            )
          })}
        </div>

        {/* Кнопка отметки */}
        <Button 
          variant={isCompletedToday ? "default" : "outline"}
          className={cn(
            "w-full transition-all duration-300",
            isCompletedToday && "bg-green-600 hover:bg-green-700 text-white"
          )}
          onClick={handleToggle}
          disabled={isPending}
        >
          <Check className={cn("mr-2 h-4 w-4", isCompletedToday ? "opacity-100" : "opacity-50")} />
          {isCompletedToday ? 'Выполнено сегодня' : 'Отметить на сегодня'}
        </Button>
      </CardContent>
    </Card>
  )
}
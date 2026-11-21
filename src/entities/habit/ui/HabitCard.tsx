import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Check, Flame } from 'lucide-react'
import { cn } from 'cn'
import type { Habit } from '../model/types'
import { useToggleHabit } from '../api/use-toggle-habit'
import { getTodayString, calculateStreak } from '@/shared/lib/date'
import { DeleteHabitButton } from '@/features/delete-habit'
import { EditHabitDialog } from '@/features/edit-habit'

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

type WeekDay = {
  label: string
  dayOfWeek: number   // 0-6, 0 = воскресенье (как в Date.getDay())
  dateStr: string     // "YYYY-MM-DD"
  isToday: boolean
  isPast: boolean     // день уже прошёл (для отображения "пропущено")
}

// Возвращает массив дней ТЕКУЩЕЙ недели (Пн → Вс)
function getCurrentWeekDays(): WeekDay[] {
  const today = new Date()
  const todayStr = getTodayString()
  const todayDayOfWeek = today.getDay()

  // Смещение к понедельнику: если воскресенье (0), то -6; иначе 1 - день
  const mondayOffset = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    // Сравниваем «по дням», без учёта времени
    const isPast = dateStr < todayStr

    return {
      label: DAY_LABELS[i],
      dayOfWeek: date.getDay(),
      dateStr,
      isToday: dateStr === todayStr,
      isPast,
    }
  })
}

export function HabitCard({ habit }: { habit: Habit }) {
  const { mutate: toggleHabit, isPending } = useToggleHabit()
  
  const todayStr = getTodayString()
  const isCompletedToday = habit.completedDates.includes(todayStr)
  const streak = calculateStreak(habit.completedDates)
  const weekDays = getCurrentWeekDays()

  const handleToggle = () => {
    toggleHabit({ id: habit.id, date: todayStr })
  }

  return (
    // Отступы как у карточки задачи на dashboard: 16px внутри, 12px между шапкой и содержимым
    <Card className="flex flex-col gap-3 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <CardTitle className="wrap-break-word text-base sm:text-lg leading-snug">{habit.title}</CardTitle>
            {habit.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{habit.description}</p>
            )}
          </div>
          {/* -mr/-mt: иконки-кнопки визуально выравниваем по краю карточки */}
          <div className="flex shrink-0 items-center gap-1 -mr-2 -mt-1">
            {streak > 0 && (
              <div
                title={`Серия: ${streak} дн. подряд`}
                className="mr-1 flex items-center gap-1 text-orange-500 font-bold bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full text-xs sm:text-sm"
              >
                <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {streak}
              </div>
            )}
            <EditHabitDialog habit={habit} />
            <DeleteHabitButton habitId={habit.id} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end gap-3 sm:gap-4">
        {/* Дни текущей недели */}
        {/* px-1 / py-1.5 — место под ring-offset «сегодня» и точку-индикатор (Card обрезает overflow) */}
        <div className="flex justify-between items-center px-1 py-1.5">
          {weekDays.map((day) => {
            const isTarget = habit.targetDays.includes(day.dayOfWeek)
            const isCompleted = habit.completedDates.includes(day.dateStr)
            
            // Определяем стиль через приоритеты (порядок важен)
            let styles = "text-muted-foreground/30" // по умолчанию — серый
            let tooltip = day.label

            if (isCompleted) {
              styles = "bg-green-500 text-white shadow-sm"
              tooltip = `${day.label} — выполнено ✓`
            } else if (day.isToday) {
              styles = "bg-primary/20 text-primary ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
              tooltip = `${day.label} — сегодня, ещё не отмечено`
            } else if (isTarget && day.isPast) {
              // Прошёл целевой день, но не выполнен — показываем приглушённо
              styles = "bg-orange-100 text-orange-600/70 dark:bg-orange-900/20 dark:text-orange-400/70"
              tooltip = `${day.label} — пропущено`
            } else if (isTarget) {
              // Будущий целевой день
              styles = "bg-primary/10 text-primary"
              tooltip = `${day.label} — запланировано`
            }

            return (
              <div 
                key={day.dateStr}
                title={tooltip}
                className={cn(
                  "relative w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-medium transition-all",
                  styles
                )}
              >
                {day.label}
                {/* Точка-индикатор «сегодня» под кружком, если не выполнено */}
                {day.isToday && !isCompleted && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            )
          })}
        </div>

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
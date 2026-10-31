import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { CheckCircle2, ListTodo, Flame, Repeat } from 'lucide-react'
import { useTasks } from '@/entities/task'
import { useHabits } from '@/entities/habit'
import { calculateStreak } from '@/shared/lib/date'

export function DashboardStats() {
  const { data: tasks = [] } = useTasks()
  const { data: habits = [] } = useHabits()

  // Считаем метрики
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  
  const totalHabits = habits.length
  // Находим максимальный стрик среди всех привычек
  const maxStreak = habits.length > 0 
    ? Math.max(...habits.map(h => calculateStreak(h.completedDates)))
    : 0

  const stats = [
    {
      title: 'Всего задач',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-500',
    },
    {
      title: 'Выполнено',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Привычек',
      value: totalHabits,
      icon: Repeat,
      color: 'text-purple-500',
    },
    {
      title: 'Лучший стрик',
      value: `${maxStreak} дн.`,
      icon: Flame,
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
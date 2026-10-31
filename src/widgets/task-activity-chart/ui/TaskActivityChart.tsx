import { useMemo } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { useTasks } from '@/entities/task'
import { getLast7Days } from '@/shared/lib/date'

export function TaskActivityChart() {
  const { data: tasks = [] } = useTasks()

  const chartData = useMemo(() => {
    const last7Days = getLast7Days()

    return last7Days.map(({ dateStr, label }) => {
      const created = tasks.filter((t) => t.createdAt.startsWith(dateStr)).length
      const completed = tasks.filter(
        (t) => t.status === 'done' && t.updatedAt.startsWith(dateStr)
      ).length

      return {
        name: label,
        Создано: created,
        Выполнено: completed,
      }
    })
  }, [tasks])

  return (
    // Убрали col-span, теперь компонент занимает всю ширину, которую ему даст родитель
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Активность за неделю</CardTitle>
        <CardDescription>
          Количество созданных и выполненных задач за последние 7 дней
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Фиолетовый цвет для "Создано" */}
            <Bar 
              dataKey="Создано" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
            />
            {/* Изумрудный цвет для "Выполнено" */}
            <Bar 
              dataKey="Выполнено" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
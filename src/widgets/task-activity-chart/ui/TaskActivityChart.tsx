import { useMemo, useState } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { useTasks } from '@/entities/task'
import { getLast7Days } from '@/shared/lib/date'
import { cn } from 'cn'

export function TaskActivityChart() {
  const { data: tasks = [] } = useTasks()
  
  // Стейт для управления видимостью линий
  const [visibleSeries, setVisibleSeries] = useState({
    created: true,
    completed: true,
  })

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

  const toggleSeries = (key: 'created' | 'completed') => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Активность за неделю</CardTitle>
        <CardDescription>
          Количество созданных и выполненных задач за последние 7 дней
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 mt-4 flex flex-col">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Градиенты для заливки под линиями */}
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                // Используем var() без hsl() для поддержки тем
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                allowDecimals={false}
              />
              
              <Tooltip 
                cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
              />

              {visibleSeries.created && (
                <Area 
                  type="monotone" 
                  dataKey="Создано" 
                  stroke="#A78BFA" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCreated)" 
                  dot={{ r: 4, fill: '#A78BFA', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              
              {visibleSeries.completed && (
                <Area 
                  type="monotone" 
                  dataKey="Выполнено" 
                  stroke="#34D399" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                  dot={{ r: 4, fill: '#34D399', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Кастомная интерактивная легенда */}
        <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
          <button 
            type="button"
            onClick={() => toggleSeries('created')}
            className={cn(
              "flex items-center gap-2 transition-opacity hover:opacity-80",
              !visibleSeries.created && "opacity-40 line-through"
            )}
          >
            <div className="w-3 h-3 rounded-full bg-[#A78BFA]" />
            <span>Создано</span>
          </button>
          
          <button 
            type="button"
            onClick={() => toggleSeries('completed')}
            className={cn(
              "flex items-center gap-2 transition-opacity hover:opacity-80",
              !visibleSeries.completed && "opacity-40 line-through"
            )}
          >
            <div className="w-3 h-3 rounded-full bg-[#34D399]" />
            <span>Выполнено</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
import { useTasks } from '@/entities/task'

export function DashboardPage() {
  const { data: tasks, isLoading, isError } = useTasks()

  if (isLoading) return <div className="p-8">Загрузка задач...</div>
  if (isError) return <div className="p-8 text-red-500">Ошибка загрузки</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
        {JSON.stringify(tasks, null, 2)}
      </pre>
    </div>
  )
}
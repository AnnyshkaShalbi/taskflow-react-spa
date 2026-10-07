import type { Task } from '@/entities/task'

const testTask: Task = {
  id: '1',
  title: 'Test',
  status: 'todo',
  priority: 'high',
  boardId: 'b1',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

console.log(testTask)

export function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Здесь будет сводка прогресса.</p>
    </div>
  )
}

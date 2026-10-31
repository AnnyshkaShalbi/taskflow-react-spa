import { KanbanBoard } from '@/widgets/kanban-board'

export function BoardPage() {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Канбан-доска</h1>
        <p className="text-muted-foreground mt-1">
          Перетаскивайте задачи между колонками для изменения статуса.
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  )
}
import { KanbanBoard } from '@/widgets/kanban-board'

export function BoardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Канбан-доска</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {/* На тач-устройствах drag запускается долгим нажатием — подсказываем это */}
          <span className="pointer-coarse:hidden">
            Перетаскивайте задачи между колонками для изменения статуса.
          </span>
          <span className="hidden pointer-coarse:inline">
            Удерживайте карточку, чтобы перетащить её в другую колонку.
          </span>
        </p>
      </div>

      <div>
        <KanbanBoard />
      </div>
    </div>
  )
}

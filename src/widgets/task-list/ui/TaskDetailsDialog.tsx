import { useRef, useState, type ReactNode } from 'react'
import { CalendarClock, CalendarPlus, History, UserRound } from 'lucide-react'
import {
  taskPriorityConfig,
  taskStatusColors,
  taskStatusLabels,
  useUpdateTask,
  type Task,
} from '@/entities/task'
import { getBoardMemberIds, useBoards } from '@/entities/board'
import { UserSelect, useUsers } from '@/entities/user'
import { AddCommentForm } from '@/features/add-comment'
import { Badge } from '@/shared/ui/badge'
import { DateInput } from '@/shared/ui/date-input'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { formatDate, getTodayString } from '@/shared/lib/date'
import { cn } from 'cn'
import { TaskComments } from './TaskComments'

type TaskDetailsDialogProps = {
  /** null — модалка закрыта */
  task: Task | null
  onOpenChange: (open: boolean) => void
}

/**
 * Подробный просмотр задачи: шапка (название) и футер (новый комментарий) закреплены,
 * тело — детали, описание, теги, комментарии — скроллится. Модалка никогда не выше экрана.
 */
export function TaskDetailsDialog({ task, onOpenChange }: TaskDetailsDialogProps) {
  // Пока модалка анимированно закрывается, task уже null — показываем последнюю задачу,
  // чтобы содержимое не исчезало раньше самой модалки.
  // (Обновление state во время рендера — рекомендуемый React-паттерн вместо useEffect)
  const [shownTask, setShownTask] = useState(task)
  if (task && task !== shownTask) setShownTask(task)

  return (
    <Dialog open={task !== null} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex flex-col gap-0 p-0 overflow-hidden',
          'sm:max-w-lg sm:max-h-[85dvh]',
        )}
      >
        {shownTask && <TaskDetails task={shownTask} />}
      </DialogContent>
    </Dialog>
  )
}

function TaskDetails({ task }: { task: Task }) {
  const { data: users = [] } = useUsers()
  const { data: boards = [] } = useBoards()
  const { mutate: updateTask } = useUpdateTask()
  const bodyRef = useRef<HTMLDivElement>(null)

  // Назначить можно только участника доски, к которой относится задача
  const board = boards.find((b) => b.id === task.boardId)
  const boardMembers = board
    ? getBoardMemberIds(board)
        .map((id) => users.find((u) => u.id === id))
        .filter((u): u is NonNullable<typeof u> => !!u)
    : []

  const priority = taskPriorityConfig[task.priority]
  const isOverdue = !!task.dueDate && task.status !== 'done' && task.dueDate < getTodayString()

  // null = очистить поле на сервере (см. UpdateTaskInput)
  const setAssignee = (assigneeId: string | undefined) =>
    updateTask({ id: task.id, input: { assigneeId: assigneeId ?? null } })
  const setDueDate = (dueDate: string | undefined) =>
    updateTask({ id: task.id, input: { dueDate: dueDate ?? null } })

  // Новый комментарий появляется внизу списка — докручиваем к нему
  const scrollToBottom = () =>
    requestAnimationFrame(() =>
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }),
    )

  return (
    <>
      {/* Шапка — не скроллится. pr-12: место под крестик закрытия */}
      <header className="shrink-0 space-y-3 border-b px-4 pt-4 pb-3 pr-12 sm:px-6 sm:pt-6 sm:pb-4 sm:pr-14">
        <DialogTitle className="wrap-break-word text-lg sm:text-xl font-semibold leading-snug">
          {task.title}
        </DialogTitle>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            <span className={cn('h-2 w-2 rounded-full', taskStatusColors[task.status])} />
            {taskStatusLabels[task.status]}
          </span>
          <Badge variant="outline" className={priority.className}>
            {priority.label} приоритет
          </Badge>
        </div>
      </header>

      {/* Тело — скроллится. overscroll-contain: прокрутка не «проваливается» на страницу под модалкой */}
      <div
        ref={bodyRef}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-6 sm:px-6 sm:py-5"
      >
        {/* Детали: исполнитель и срок редактируются прямо здесь */}
        <dl className="grid grid-cols-1 gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
          <DetailItem icon={<UserRound />} label="Исполнитель">
            <UserSelect
              users={boardMembers}
              value={task.assigneeId}
              onChange={setAssignee}
              aria-label="Исполнитель"
              className="bg-background"
            />
          </DetailItem>

          <DetailItem icon={<CalendarClock />} label={isOverdue ? 'Срок · просрочено' : 'Срок'} danger={isOverdue}>
            <DateInput
              value={task.dueDate}
              onChange={setDueDate}
              aria-label="Срок"
              className={cn('[&_input]:bg-background', isOverdue && '[&_input]:border-destructive/50 [&_input]:text-destructive')}
            />
          </DetailItem>

          <DetailItem icon={<CalendarPlus />} label="Создана">
            {formatDate(task.createdAt, true)}
          </DetailItem>

          <DetailItem icon={<History />} label="Обновлена">
            {formatDate(task.updatedAt, true)}
          </DetailItem>
        </dl>

        {/* Описание */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Описание</h3>
          {task.description ? (
            // pre-wrap — сохраняем переносы строк, которые пользователь ввёл в textarea
            <DialogDescription className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground">
              {task.description}
            </DialogDescription>
          ) : (
            <DialogDescription className="text-sm italic text-muted-foreground">
              Описание не добавлено
            </DialogDescription>
          )}
        </section>

        {/* Теги */}
        {task.tags.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Теги</h3>
            <ul className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  #{tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <TaskComments taskId={task.id} />
      </div>

      {/* Футер — поле нового комментария всегда под рукой, как в мессенджере */}
      <footer className="shrink-0 border-t bg-popover px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3">
        <AddCommentForm taskId={task.id} onAdded={scrollToBottom} />
      </footer>
    </>
  )
}

type DetailItemProps = {
  icon: ReactNode
  label: string
  children: ReactNode
  /** Подсветить подпись (например, просроченный срок) */
  danger?: boolean
}

function DetailItem({ icon, label, children, danger }: DetailItemProps) {
  return (
    <div className="min-w-0 space-y-1">
      <dt
        className={cn(
          'flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5',
          danger && 'font-medium text-destructive',
        )}
      >
        {icon}
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

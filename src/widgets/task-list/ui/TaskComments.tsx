import { MessageSquare } from 'lucide-react'
import { useComments } from '@/entities/comment'
import { useAuthStore, useUsers } from '@/entities/user'
import { DeleteCommentButton } from '@/features/delete-comment'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Skeleton } from '@/shared/ui/skeleton'
import { formatDate, formatRelativeTime } from '@/shared/lib/date'
import { getInitials } from '@/shared/lib/get-initials'
import { cn } from 'cn'

type TaskCommentsProps = {
  taskId: string
}

/** Список комментариев задачи. Поле ввода — отдельно, в закреплённом футере модалки */
export function TaskComments({ taskId }: TaskCommentsProps) {
  const { data: comments, isLoading, isError } = useComments(taskId)
  const { data: users = [] } = useUsers()
  const currentUserId = useAuthStore((s) => s.user?.id)

  return (
    <section aria-labelledby="task-comments-title" className="space-y-3">
      <h3
        id="task-comments-title"
        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        Комментарии
        {comments && comments.length > 0 && (
          <span className="tabular-nums normal-case">· {comments.length}</span>
        )}
      </h3>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-destructive">Не удалось загрузить комментарии</p>}

      {comments && comments.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-6 text-center">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Пока нет комментариев. Начните обсуждение</p>
        </div>
      )}

      {comments && comments.length > 0 && (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const author = users.find((u) => u.id === comment.authorId)
            const isOwn = comment.authorId === currentUserId
            const authorName = author?.name ?? 'Неизвестный пользователь'

            return (
              <li
                key={comment.id}
                className={cn('group flex gap-3 transition-opacity', comment.isPending && 'opacity-60')}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      'text-[11px] font-semibold',
                      isOwn ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
                    )}
                  >
                    {getInitials(authorName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 truncate text-sm font-medium">
                      {authorName}
                      {isOwn && <span className="font-normal text-muted-foreground"> (вы)</span>}
                    </p>
                    <time
                      dateTime={comment.createdAt}
                      title={formatDate(comment.createdAt, true)}
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      {comment.isPending ? 'отправка…' : formatRelativeTime(comment.createdAt)}
                    </time>

                    {/* Удалить можно только свой комментарий (сервер тоже это проверяет — 403).
                        С мышью кнопка появляется при наведении, на таче видна всегда */}
                    {isOwn && !comment.isPending && (
                      <DeleteCommentButton
                        taskId={taskId}
                        commentId={comment.id}
                        className={cn(
                          'ml-auto shrink-0',
                          'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100',
                        )}
                      />
                    )}
                  </div>

                  <p className="mt-0.5 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

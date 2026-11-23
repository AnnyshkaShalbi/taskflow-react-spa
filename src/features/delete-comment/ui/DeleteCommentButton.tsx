import { Trash2 } from 'lucide-react'
import { useDeleteComment } from '@/entities/comment'
import { Button } from '@/shared/ui/button'
import { cn } from 'cn'

type DeleteCommentButtonProps = {
  taskId: string
  commentId: string
  className?: string
}

export function DeleteCommentButton({ taskId, commentId, className }: DeleteCommentButtonProps) {
  const { mutate, isPending } = useDeleteComment(taskId)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label="Удалить комментарий"
      disabled={isPending}
      onClick={() => mutate(commentId)}
      className={cn('text-muted-foreground hover:text-destructive', className)}
    >
      <Trash2 />
    </Button>
  )
}

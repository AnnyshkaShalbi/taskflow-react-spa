import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp } from 'lucide-react'
import {
  COMMENT_MAX_LENGTH,
  commentSchema,
  useAddComment,
  type CommentFormValues,
} from '@/entities/comment'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from 'cn'

type AddCommentFormProps = {
  taskId: string
  /** Вызывается сразу после отправки (комментарий уже в списке — оптимистично) */
  onAdded?: () => void
}

export function AddCommentForm({ taskId, onAdded }: AddCommentFormProps) {
  const { mutate } = useAddComment(taskId)
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  })

  // useWatch, а не form.watch(): подписка на одно поле, совместимо с React Compiler
  const text = useWatch({ control: form.control, name: 'text' })
  const canSubmit = text.trim().length > 0 && text.length <= COMMENT_MAX_LENGTH
  // Счётчик показываем только ближе к лимиту — чтобы не шуметь
  const showCounter = text.length > COMMENT_MAX_LENGTH * 0.8

  const onSubmit = ({ text }: CommentFormValues) => {
    // Оптимистично: поле очищаем сразу, комментарий уже появился в списке.
    // Если сервер ответит ошибкой — возвращаем текст, чтобы его не пришлось набирать заново
    form.reset()
    mutate(text, {
      onError: () => form.setValue('text', text),
    })
    onAdded?.()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
      <div className="flex items-end gap-2">
        <Textarea
          {...form.register('text')}
          placeholder="Написать комментарий…"
          aria-label="Новый комментарий"
          rows={1}
          // Растёт по содержимому (field-sizing-content), но не выше ~5 строк
          className="min-h-9 max-h-32 flex-1 resize-none py-2"
          onKeyDown={(e) => {
            // Ctrl/Cmd + Enter — отправить; просто Enter — перенос строки
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              form.handleSubmit(onSubmit)()
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!canSubmit}
          aria-label="Отправить комментарий"
          className="h-9 w-9 shrink-0 rounded-full"
        >
          <ArrowUp />
        </Button>
      </div>

      <div className="flex justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        {/* Подсказка про сочетание клавиш — только там, где есть клавиатура */}
        <span className="pointer-coarse:invisible">Ctrl + Enter — отправить</span>
        {showCounter && (
          <span className={cn('tabular-nums', text.length > COMMENT_MAX_LENGTH && 'text-destructive')}>
            {text.length}/{COMMENT_MAX_LENGTH}
          </span>
        )}
      </div>
    </form>
  )
}

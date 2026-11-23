import { X } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type DateInputProps = {
  /** Дата в формате "YYYY-MM-DD" или undefined */
  value?: string
  onChange: (value: string | undefined) => void
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

/**
 * Поле даты на нативном <input type="date">: на телефоне открывается системный
 * календарь (самый удобный вариант для тача), на десктопе — календарь браузера.
 * Кнопка очистки появляется, когда дата выбрана.
 */
export function DateInput({ value, onChange, disabled, className, ...props }: DateInputProps) {
  return (
    // Кнопка очистки — рядом, а не поверх поля: справа в поле браузер рисует свою иконку календаря
    <div className={cn('flex items-center gap-1', className)}>
      <Input
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
        className="min-w-0 flex-1"
        {...props}
      />
      {value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Очистить дату"
          onClick={() => onChange(undefined)}
          className="shrink-0 text-muted-foreground"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

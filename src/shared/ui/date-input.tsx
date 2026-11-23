import { useState } from 'react'
import { addDays, format, isValid, parseISO } from 'date-fns'
import { ru } from 'react-day-picker/locale'
import { CalendarDays, X } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

type DateInputProps = {
  /** Дата в формате "YYYY-MM-DD" или undefined */
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** Подсветить как ошибку (например, просроченный срок) */
  invalid?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

// "YYYY-MM-DD" ↔ Date. parseISO читает дату без времени как ЛОКАЛЬНУЮ полночь,
// поэтому день не «съезжает» из-за часового пояса (в отличие от new Date('2026-11-28'))
const toDate = (value?: string) => {
  if (!value) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}
const toValue = (date: Date) => format(date, 'yyyy-MM-dd')

const PRESETS = [
  { label: 'Сегодня', days: 0 },
  { label: 'Завтра', days: 1 },
  { label: 'Через неделю', days: 7 },
]

/**
 * Выбор даты: кнопка-триггер + календарь shadcn (react-day-picker) в поповере.
 * Одинаково выглядит во всех браузерах; на тач-устройствах ячейки крупнее (40px).
 */
export function DateInput({
  value,
  onChange,
  placeholder = 'Выберите дату',
  disabled,
  invalid,
  className,
  id,
  'aria-label': ariaLabel,
}: DateInputProps) {
  const [open, setOpen] = useState(false)
  const selected = toDate(value)

  const select = (date: Date | undefined) => {
    onChange(date ? toValue(date) : undefined)
    setOpen(false)
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              aria-label={ariaLabel}
              className={cn(
                'min-w-0 flex-1 justify-start gap-2 bg-background font-normal',
                // на таче поле выше — как остальные поля ввода
                'pointer-coarse:h-10',
                !selected && 'text-muted-foreground',
                invalid && 'border-destructive/50 text-destructive',
              )}
            />
          }
        >
          <CalendarDays className="shrink-0 opacity-70" />
          <span className="truncate">
            {selected ? format(selected, 'd MMMM yyyy', { locale: ru }) : placeholder}
          </span>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          // w-auto: ширину задаёт календарь; p-0 — отступы внутри календаря
          className="w-auto gap-0 p-0"
        >
          {/* Быстрый выбор — самые частые сроки в один тап */}
          <div className="flex gap-1 border-b p-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => select(addDays(new Date(), preset.days))}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Calendar
            mode="single"
            // required: повторный клик по выбранному дню не сбрасывает дату
            // (в режиме single react-day-picker по умолчанию «снимает» выбор).
            // Очистка — только явной кнопкой ✕
            required
            locale={ru}
            selected={selected}
            onSelect={select}
            defaultMonth={selected}
            // Ячейка 32px с мышью и 40px на таче — удобно попадать пальцем
            className="[--cell-size:--spacing(8)] pointer-coarse:[--cell-size:--spacing(10)]"
          />
        </PopoverContent>
      </Popover>

      {/* Кнопка очистки — рядом с полем, видна только когда дата выбрана */}
      {selected && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Очистить дату"
          onClick={() => onChange(undefined)}
          className="shrink-0 text-muted-foreground pointer-coarse:size-10"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import {
  createHabitSchema,
  useCreateHabit,
  type CreateHabitFormValues,
} from '@/entities/habit'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { cn } from 'cn'

const WEEK_DAYS = [
  { label: 'Пн', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 },
  { label: 'Пт', value: 5 },
  { label: 'Сб', value: 6 },
  { label: 'Вс', value: 0 },
]

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateHabit()

  const form = useForm<CreateHabitFormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      title: '',
      description: '',
      frequency: 'daily',
      targetDays: [1, 2, 3, 4, 5], // По умолчанию будни
    },
  })

  const onSubmit = (values: CreateHabitFormValues) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        setOpen(false)
      },
    })
  }

  // Логика выбора дней недели
  const toggleDay = (dayValue: number) => {
    const currentDays = form.getValues('targetDays')
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue].sort()
    
    // Принудительно обновляем значение в форме и запускаем валидацию
    form.setValue('targetDays', newDays, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Создать привычку
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Новая привычка</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Пить воду" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание (необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="Детали..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дни выполнения</FormLabel>
                  <div className="flex justify-between gap-1 mt-2">
                    {WEEK_DAYS.map((day) => {
                      const isActive = field.value.includes(day.value)
                      return (
                        <button
                          key={day.value}
                          type="button" // Важно, чтобы не было отправки формы
                          onClick={() => toggleDay(day.value)}
                          className={cn(
                            "w-9 h-9 rounded-full text-xs font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать привычку'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
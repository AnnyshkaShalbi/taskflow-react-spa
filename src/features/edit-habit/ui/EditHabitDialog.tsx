import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import {
  createHabitSchema,
  useUpdateHabit,
  type CreateHabitFormValues,
} from '@/entities/habit'
import type { Habit } from '@/entities/habit'
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
  { label: 'Пн', value: 1 }, { label: 'Вт', value: 2 }, { label: 'Ср', value: 3 },
  { label: 'Чт', value: 4 }, { label: 'Пт', value: 5 }, { label: 'Сб', value: 6 },
  { label: 'Вс', value: 0 },
]

export function EditHabitDialog({ habit }: { habit: Habit }) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdateHabit()

  const form = useForm<CreateHabitFormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      targetDays: habit.targetDays,
    },
  })

  const onSubmit = (values: CreateHabitFormValues) => {
    mutate({ id: habit.id, input: values }, {
      onSuccess: () => setOpen(false)
    })
  }

  const toggleDay = (dayValue: number) => {
    const currentDays = form.getValues('targetDays')
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue].sort()
    form.setValue('targetDays', newDays, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" />
      }>
        <Pencil className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Редактировать привычку</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="targetDays" render={({ field }) => (
              <FormItem>
                <FormLabel>Дни выполнения</FormLabel>
                <div className="flex justify-between gap-1 mt-2">
                  {WEEK_DAYS.map((day) => {
                    const isActive = field.value.includes(day.value)
                    return (
                      <button key={day.value} type="button" onClick={() => toggleDay(day.value)}
                        className={cn("w-9 h-9 rounded-full text-xs font-medium transition-colors",
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
                      >
                        {day.label}
                      </button>
                    )
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
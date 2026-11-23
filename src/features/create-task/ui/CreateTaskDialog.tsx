import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import {
  createTaskSchema,
  useCreateTask,
  TASK_STATUSES,
  taskStatusLabels,
  taskPriorityConfig,
  type TaskPriority,
  type CreateTaskInputValues,
  type CreateTaskFormValues,
} from '@/entities/task'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { getBoardMemberIds, useBoardStore, useBoards } from '@/entities/board'
import { UserSelect, useUsers } from '@/entities/user'
import { DateInput } from '@/shared/ui/date-input'

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']
// value → подпись для Select (иначе в поле видно 'medium', а не «Средний»)
const priorityItems = Object.fromEntries(
  PRIORITIES.map((p) => [p, taskPriorityConfig[p].label]),
) as Record<TaskPriority, string>

type CreateTaskDialogProps = {
  triggerClassName?: string
}

export function CreateTaskDialog({ triggerClassName }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateTask()
  const activeBoardId = useBoardStore((s) => s.activeBoardId)

  // Назначить можно только участника текущей доски
  const { data: boards = [] } = useBoards()
  const { data: users = [] } = useUsers()
  const activeBoard = boards.find((b) => b.id === activeBoardId)
  const boardMembers = activeBoard
    ? getBoardMemberIds(activeBoard)
        .map((id) => users.find((u) => u.id === id))
        .filter((u): u is NonNullable<typeof u> => !!u)
    : []

  const form = useForm<CreateTaskInputValues, unknown, CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        boardId: activeBoardId,
        tags: [],
    },
  })

  const onSubmit = (values: CreateTaskFormValues) => {
    mutate(
      { ...values, boardId: activeBoardId }, 
      {
        onSuccess: () => {
          form.reset()
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className={triggerClassName} />}>
        <Plus className="mr-2 h-4 w-4" />
        Создать задачу
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
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
                    <Input placeholder="Например: Написать тесты" {...field} />
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
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Детали задачи..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select
                      items={taskStatusLabels}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {taskStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Приоритет</FormLabel>
                    <Select
                      items={priorityItems}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priorityItems[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Дата на мобилке узкой колонкой не помещается — поля друг под другом */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Исполнитель</FormLabel>
                    <FormControl>
                      <UserSelect users={boardMembers} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Срок</FormLabel>
                    <FormControl>
                      <DateInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать задачу'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
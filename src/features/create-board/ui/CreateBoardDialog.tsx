import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  createBoardSchema, 
  useCreateBoard, 
  useBoardStore,
  type CreateBoardInput 
} from '@/entities/board'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'

type CreateBoardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const { mutate, isPending } = useCreateBoard()
  const setActiveBoardId = useBoardStore((s) => s.setActiveBoardId)

  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    },
  })

  const onSubmit = (values: CreateBoardInput) => {
    mutate(values, {
      onSuccess: (newBoard) => {
        form.reset()
        onOpenChange(false) // Закрываем через родителя
        setActiveBoardId(newBoard.id) 
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Убрали DialogTrigger, так как открывать будем программно */}
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Новая доска</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название доски</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Проект Х" {...field} />
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
                    <Input placeholder="Для чего эта доска?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать доску'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
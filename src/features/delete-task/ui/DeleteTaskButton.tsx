import { Trash2 } from 'lucide-react'
import { useDeleteTask } from '@/entities/task'
import { Button } from '@/shared/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'

type DeleteTaskButtonProps = {
  taskId: string
}

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const { mutate, isPending } = useDeleteTask()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" />
      }>
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Задача будет удалена навсегда.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline" />}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction 
            render={<Button variant="destructive" />}
            onClick={() => mutate(taskId)}
            disabled={isPending}
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
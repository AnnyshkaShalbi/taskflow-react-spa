import { Trash2 } from 'lucide-react'
import { useDeleteHabit } from '@/entities/habit'
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

export function DeleteHabitButton({ habitId }: { habitId: string }) {
  const { mutate, isPending } = useDeleteHabit()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" />
      }>
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить привычку?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Вся история выполнений будет удалена.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline" />}>Отмена</AlertDialogCancel>
          <AlertDialogAction 
            render={<Button variant="destructive" />}
            onClick={() => mutate(habitId)}
            disabled={isPending}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
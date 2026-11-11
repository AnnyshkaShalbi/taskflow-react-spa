import { useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { useLogout } from '@/entities/user'
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

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // После очистки стейта перекидываем на логин
        navigate('/login', { replace: true })
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button variant="destructive" className="w-full sm:w-auto" />
      }>
        <LogOut className="mr-2 h-4 w-4" />
        Выйти из аккаунта
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены, что хотите выйти?</AlertDialogTitle>
          <AlertDialogDescription>
            Вам придется снова ввести свои данные для входа в систему.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline" />}>Отмена</AlertDialogCancel>
          <AlertDialogAction 
            render={<Button variant="destructive" />}
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? 'Выход...' : 'Выйти'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
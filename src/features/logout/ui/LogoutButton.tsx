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
import { cn } from 'cn'

type LogoutButtonProps = {
  /**
   * button — заметная красная кнопка (настройки, «Опасная зона»);
   * sidebar — неброский пункт в стиле навигации (низ сайдбара)
   */
  variant?: 'button' | 'sidebar'
  className?: string
}

export function LogoutButton({ variant = 'button', className }: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout(undefined, {
      // После очистки стейта перекидываем на логин
      onSuccess: () => navigate('/login', { replace: true }),
    })
  }

  const trigger =
    variant === 'sidebar' ? (
      <button
        type="button"
        className={cn(
          // Те же размеры и отступы, что у пунктов навигации — визуально это один список
          'flex w-full items-center gap-3 rounded-md px-3 py-2 pointer-coarse:py-2.5 text-sm',
          'text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          className,
        )}
      />
    ) : (
      <Button variant="destructive" className={cn('w-full gap-2 sm:w-auto', className)} />
    )

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger}>
        <LogOut className="h-4 w-4" />
        {variant === 'sidebar' ? 'Выйти' : 'Выйти из аккаунта'}
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

import { Link } from 'react-router'
import { ListTodo } from 'lucide-react'
import { useAuthStore } from '@/entities/user'
import { ThemeToggle } from '@/features/theme-toggle'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { getInitials } from '@/shared/lib/get-initials'
import { MobileSidebar } from '@/widgets/sidebar'

export function Header() {
  const user = useAuthStore((s) => s.user)

  // Шапка закреплена на всех размерах: под ней прилипают сайдбар (десктоп) и табы канбана.
  // h-14 стоит на самом <header> (border-box): ровно 56px вместе с border-b — на эту высоту
  // завязаны top-14 у сайдбара и табов. Если задать h-14 внутреннему блоку, шапка станет 57px
  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-background">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-1">
          <MobileSidebar />
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ListTodo className="h-5 w-5" />
            <span>TaskFlow</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user?.name ? getInitials(user.name) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

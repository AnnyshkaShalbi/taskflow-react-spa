import { Link } from 'react-router'
import { ListTodo, User } from 'lucide-react'
import { ThemeToggle } from '@/features/theme-toggle'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <ListTodo className="h-5 w-5" />
          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

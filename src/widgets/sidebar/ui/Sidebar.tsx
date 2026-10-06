import { NavLink } from 'react-router'
import { LayoutDashboard, KanbanSquare, Repeat, Settings } from 'lucide-react'
import { cn } from 'cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Board', icon: KanbanSquare },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 flex-col border-r bg-background p-3">
      <nav className="flex flex-col gap-1 text-sm">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

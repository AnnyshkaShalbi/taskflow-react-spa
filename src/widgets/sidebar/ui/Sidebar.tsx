import { NavLink } from 'react-router'
import { LayoutDashboard, KanbanSquare, Repeat, Settings } from 'lucide-react'
import { cn } from 'cn'
import { BoardSwitcher } from './BoardSwitcher'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Board', icon: KanbanSquare },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/settings', label: 'Settings', icon: Settings },
]

type SidebarContentProps = {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <BoardSwitcher />
      </div>

      <nav className="flex flex-col gap-1 text-sm">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
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
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:block w-56 shrink-0 border-r bg-background">
      {/* aside растягивается на всю высоту контента (для border-r),
          а внутренний блок прилипает к верху при скролле */}
      <div className="sticky top-0 max-h-screen overflow-y-auto p-3">
        <SidebarContent />
      </div>
    </aside>
  )
}

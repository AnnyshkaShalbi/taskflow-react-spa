import { NavLink } from 'react-router'
import { LayoutDashboard, KanbanSquare, Repeat, Settings } from 'lucide-react'
import { LogoutButton } from '@/features/logout'
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

/**
 * Содержимое сайдбара — общее для десктопа и мобильного меню.
 * Занимает всю высоту родителя: навигация сверху (скроллится, если не влезает),
 * «Выйти» прижат к низу.
 */
export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
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
                  'flex items-center gap-3 px-3 py-2 pointer-coarse:py-2.5 rounded-md transition-colors',
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

      <div className="shrink-0 border-t p-3">
        <LogoutButton variant="sidebar" />
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:block w-56 shrink-0 border-r bg-background">
      {/* aside тянется на всю высоту контента (ради border-r), а внутренний блок
          прилипает под шапкой (h-14) и занимает ровно оставшуюся высоту экрана —
          поэтому «Выйти» всегда внизу */}
      <div className="sticky top-14 h-[calc(100dvh-3.5rem)]">
        <SidebarContent />
      </div>
    </aside>
  )
}

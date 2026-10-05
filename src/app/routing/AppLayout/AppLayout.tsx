import { NavLink, Outlet } from 'react-router'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/board', label: 'Board' },
  { to: '/habits', label: 'Habits' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="px-6 py-3 flex items-center">
          <span className="font-semibold">TaskFlow</span>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-56 border-r bg-background p-4">
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

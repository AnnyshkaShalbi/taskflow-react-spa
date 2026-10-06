import { Outlet } from 'react-router'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

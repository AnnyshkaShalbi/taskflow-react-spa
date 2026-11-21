import { Outlet } from 'react-router'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        {/* min-w-0: не даём широкому контенту (лента канбана) растягивать main за пределы экрана */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

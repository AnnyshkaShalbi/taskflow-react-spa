import { useMe } from '@/entities/user'
import { useAuthStore } from '@/entities/user'

export function DashboardPage() {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const { isLoading, isFetching } = useMe()

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Status: {status}</p>
      <p>User: {user?.name ?? 'нет'}</p>
      <p>isLoading: {String(isLoading)}</p>
      <p>isFetching: {String(isFetching)}</p>
    </div>
  )
}
import { useAuthStore } from '@/entities/user'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const status = useAuthStore((s) => s.status)

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Status: {status}</p>
      <p>User: {user ? user.name : 'нет'}</p>
      <p>Token: {token ?? 'нет'}</p>
    </div>
  )
}
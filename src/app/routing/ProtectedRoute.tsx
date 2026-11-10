import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/entities/user'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
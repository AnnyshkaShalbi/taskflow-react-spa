import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/entities/user'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    // Редиректим на логин, сохраняя текущий путь, 
    // чтобы после входа вернуть пользователя туда, куда он шёл
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
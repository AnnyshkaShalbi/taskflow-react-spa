import { useNavigate } from 'react-router'
import { LoginForm } from '@/features/auth-by-email'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-sm text-muted-foreground">
            Войдите, чтобы продолжить работу
          </p>
        </div>

        <LoginForm onSuccess={() => navigate('/', { replace: true })} />
      </div>
    </div>
  )
}
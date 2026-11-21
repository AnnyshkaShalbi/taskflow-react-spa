import { useNavigate } from 'react-router'
import { ListTodo } from 'lucide-react'
import { LoginForm } from '@/features/auth-by-email'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    // min-h-dvh вместо min-h-screen: на мобилке 100vh не учитывает панели браузера,
    // из-за чего форма уезжает ниже центра и появляется лишний скролл.
    // py — чтобы в альбомной ориентации форма не прилипала к краям
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-8 sm:px-6">
      {/* На мобилке — без рамки, на всю ширину; с sm — карточка по центру экрана */}
      <div className="w-full max-w-sm space-y-6 sm:space-y-8 sm:max-w-md sm:rounded-xl sm:border sm:bg-card sm:p-8 sm:shadow-sm">
        <div className="flex flex-col items-center text-center gap-3">
          {/* Логотип — как в шапке приложения */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListTodo className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">TaskFlow</h1>
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы продолжить работу
            </p>
          </div>
        </div>

        <LoginForm onSuccess={() => navigate('/', { replace: true })} />
      </div>
    </div>
  )
}

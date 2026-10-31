import { type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore, useMe } from '@/entities/user'

type AuthInitializerProps = {
  children: ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const token = useAuthStore((s) => s.token)
  const { isLoading } = useMe()

  // Если токен есть, но /me ещё не ответил — показываем лоадер
  if (token && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Во всех остальных случаях рендерим приложение
  return <>{children}</>
}
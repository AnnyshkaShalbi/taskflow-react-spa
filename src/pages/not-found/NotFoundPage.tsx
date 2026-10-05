import { Link } from 'react-router'
import { buttonVariants } from '@/shared/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">Страница не найдена</p>
      <Link to="/" className={buttonVariants()}>
        На главную
      </Link>
    </div>
  )
}

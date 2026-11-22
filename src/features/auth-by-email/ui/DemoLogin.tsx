import { useIsMutating } from '@tanstack/react-query'
import { ArrowRight, Loader2 } from 'lucide-react'
import { LOGIN_MUTATION_KEY, useLogin } from '@/entities/user'
import { ApiError } from '@/shared/api/http'
import { DEMO_ACCOUNTS, IS_DEMO_MODE } from '@/shared/config/demo'
import { getInitials } from '@/shared/lib/get-initials'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { cn } from 'cn'

type DemoLoginProps = {
  onSuccess?: () => void
}

/**
 * Быстрый вход под демо-пользователем — для ревьюеров портфолио.
 * Идёт через тот же useLogin, что и форма: полный путь запрос → MSW → токен → store.
 * Вне демо-режима не рендерится.
 */
export function DemoLogin({ onSuccess }: DemoLoginProps) {
  const { mutate, isPending, variables, error } = useLogin()
  // Блокируем карточки и во время входа через форму (и наоборот — см. LoginForm)
  const isAnyLoginPending = useIsMutating({ mutationKey: LOGIN_MUTATION_KEY }) > 0

  if (!IS_DEMO_MODE) return null

  const apiError = error instanceof ApiError ? error.message : null

  return (
    <section aria-labelledby="demo-login-title" className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <h2 id="demo-login-title">или войдите как демо-пользователь</h2>
        <span className="h-px flex-1 bg-border" />
      </div>

      <ul className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => {
          const isThisPending = isPending && variables?.email === account.email

          return (
            <li key={account.email}>
              <button
                type="button"
                disabled={isAnyLoginPending}
                aria-busy={isThisPending}
                onClick={() =>
                  mutate(
                    { email: account.email, password: account.password },
                    { onSuccess: () => onSuccess?.() },
                  )
                }
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  'hover:bg-accent/50 hover:border-primary/30',
                  'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring',
                  'disabled:cursor-not-allowed',
                  // Пока идёт вход — приглушаем все карточки, кроме выбранной
                  isAnyLoginPending && !isThisPending && 'opacity-50',
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(account.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{account.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{account.description}</p>
                </div>

                {isThisPending ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {apiError && (
        <p role="alert" className="text-sm text-destructive">{apiError}</p>
      )}
    </section>
  )
}

import { DEMO_ACCOUNTS } from '@/shared/config/demo'

// Пароли берём из конфига демо-аккаунтов — единый источник для MSW и страницы входа
export const mockCredentials: Record<string, string> = Object.fromEntries(
  DEMO_ACCOUNTS.map(({ email, password }) => [email, password]),
)

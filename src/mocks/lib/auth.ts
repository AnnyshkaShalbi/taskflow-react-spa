import { HttpResponse } from 'msw'

/**
 * Имитация JWT: токен = base64(userId). Stateless — серверу не нужно хранить сессии.
 * В настоящем бэкенде здесь была бы проверка подписи токена.
 */
export function createToken(userId: string): string {
  return btoa(userId)
}

/** id пользователя из заголовка `Authorization: Bearer <token>` или null, если не авторизован */
export function getUserIdFromRequest(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  try {
    return atob(header.slice('Bearer '.length)) || null
  } catch {
    return null
  }
}

// Единый формат ошибок API: { message } + HTTP-статус
export const unauthorized = () =>
  HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })

export const forbidden = (message: string) => HttpResponse.json({ message }, { status: 403 })

export const notFound = (message: string) => HttpResponse.json({ message }, { status: 404 })

export const badRequest = (message: string) => HttpResponse.json({ message }, { status: 400 })

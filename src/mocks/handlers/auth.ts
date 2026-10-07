import { http, HttpResponse, delay } from 'msw'
import type { LoginInput, AuthResponse } from '@/entities/user'
import { mockUsers } from '../data/users'
import { mockCredentials } from '../data/auth'

// In-memory хранилище активных токенов: token -> userId
const activeTokens = new Map<string, string>()

export const authHandlers = [
  // POST /api/auth/login — вход
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500) // имитируем реальный сервер — логин всегда медленный

    const { email, password } = (await request.json()) as LoginInput

    // 1. Проверяем, есть ли такой email
    const expectedPassword = mockCredentials[email]
    if (!expectedPassword) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    // 2. Проверяем пароль
    if (expectedPassword !== password) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    // 3. Находим пользователя
    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    // 4. Генерируем токен и запоминаем его
    const token = crypto.randomUUID()
    activeTokens.set(token, user.id)

    const response: AuthResponse = { user, token }
    return HttpResponse.json(response)
  }),

  // GET /api/auth/me — текущий пользователь по токену
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)

    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    }

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'Пользователь не найден' }, { status: 401 })
    }

    return HttpResponse.json(user)
  }),

  // POST /api/auth/logout — выход (удаляем токен)
  http.post('/api/auth/logout', async ({ request }) => {
    await delay(200)

    const token = getTokenFromRequest(request)
    if (token) {
      activeTokens.delete(token)
    }

    return new HttpResponse(null, { status: 204 })
  }),
]

// ---- Хелперы ----

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null
  if (!authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7) // отрезаем "Bearer "
}

function getUserIdFromRequest(request: Request): string | null {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return activeTokens.get(token) ?? null
}

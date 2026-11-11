import { http, HttpResponse, delay } from 'msw'
import type { LoginInput, AuthResponse } from '@/entities/user'
import { mockUsers } from '../data/users'
import { mockCredentials } from '../data/auth'
import { getUsers } from './users'

// Имитация JWT: кодируем userId в base64.
// Это stateless-подход: серверу не нужно хранить сессии в памяти.
function createToken(userId: string): string {
  return btoa(userId)
}

function getUserIdFromToken(token: string): string | null {
  try {
    const userId = atob(token)
    return userId || null
  } catch {
    return null
  }
}

export const authHandlers = [
  // POST /api/auth/login — вход
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)

    const { email, password } = (await request.json()) as LoginInput

    const expectedPassword = mockCredentials[email]
    if (!expectedPassword || expectedPassword !== password) {
      return HttpResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 },
      )
    }

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      return HttpResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 },
      )
    }

    const token = createToken(user.id)
    const response: AuthResponse = { user, token }
    
    return HttpResponse.json(response)
  }),

  // GET /api/auth/me — текущий пользователь по токену
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)

    const token = getTokenFromRequest(request)
    if (!token) {
      return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Невалидный токен' }, { status: 401 })
    }

    // ИСПОЛЬЗУЕМ getUsers() вместо mockUsers
    const users = getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json({ message: 'Пользователь не найден' }, { status: 401 })
    }

    return HttpResponse.json(user)
  }),

  // POST /api/auth/logout — выход
  http.post('/api/auth/logout', async () => {
    await delay(200)
    // При stateless-токенах сервер просто подтверждает выход.
    // Клиент сам удаляет токен из localStorage и Zustand.
    return new HttpResponse(null, { status: 204 })
  }),
]

// ---- Хелпер ----

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
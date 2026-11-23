import { http, HttpResponse, delay } from 'msw'
import type { LoginInput, AuthResponse } from '@/entities/user'
import { mockCredentials } from '../data/auth'
import { db } from '../db'
import { createToken, getUserIdFromRequest, unauthorized } from '../lib/auth'

export const authHandlers = [
  // POST /api/auth/login — вход
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    const { email, password } = (await request.json()) as LoginInput

    const user = db.users.getAll().find((u) => u.email === email)
    // Одинаковое сообщение для «нет пользователя» и «неверный пароль» —
    // чтобы по ответу нельзя было перебором узнать, какие email зарегистрированы
    if (!user || mockCredentials[email] !== password) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    const response: AuthResponse = { user, token: createToken(user.id) }
    return HttpResponse.json(response)
  }),

  // GET /api/auth/me — текущий пользователь по токену
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    const user = userId ? db.users.getAll().find((u) => u.id === userId) : undefined
    if (!user) return unauthorized()

    return HttpResponse.json(user)
  }),

  // POST /api/auth/logout — выход. При stateless-токенах сервер просто подтверждает,
  // токен удаляет клиент (localStorage + Zustand)
  http.post('/api/auth/logout', async () => {
    await delay(200)
    return new HttpResponse(null, { status: 204 })
  }),
]

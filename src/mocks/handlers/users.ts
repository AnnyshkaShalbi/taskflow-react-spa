import { http, HttpResponse, delay } from 'msw'
import type { User } from '@/entities/user'
import { db } from '../db'
import { getUserIdFromRequest, notFound, unauthorized } from '../lib/auth'

export const userHandlers = [
  // PATCH /api/users/me — обновление профиля ТЕКУЩЕГО пользователя (id — из токена)
  http.patch('/api/users/me', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    // Менять разрешено только имя — id, email и прочее из тела запроса игнорируем
    const { name } = (await request.json()) as Pick<User, 'name'>
    const users = db.users.getAll()
    const index = users.findIndex((u) => u.id === userId)
    if (index === -1) return notFound('Пользователь не найден')

    users[index] = { ...users[index], name }
    db.users.saveAll(users)
    return HttpResponse.json(users[index])
  }),

  // GET /api/users — все пользователи (для шаринга и аватаров)
  http.get('/api/users', async ({ request }) => {
    await delay(200)
    if (!getUserIdFromRequest(request)) return unauthorized()
    return HttpResponse.json(db.users.getAll())
  }),
]

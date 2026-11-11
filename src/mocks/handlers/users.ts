import { http, HttpResponse, delay } from 'msw'
import type { User } from '@/entities/user'
import { mockUsers } from '../data/users'

const STORAGE_KEY = 'taskflow-mock-users'

// Читаем пользователей из localStorage или берем моки
export function getUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return [...mockUsers]
    }
  }
  return [...mockUsers]
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const userHandlers = [
  // PATCH /api/users/me — обновление текущего пользователя
  http.patch('/api/users/me', async ({ request }) => {
    await delay(300)
    const patch = (await request.json()) as Partial<User>
    
    const users = getUsers()
    // В реальном приложении ID пользователя берется из токена. 
    // У нас пока хардкод user-1.
    const currentUserId = 'user-1' 
    const index = users.findIndex((u) => u.id === currentUserId)

    if (index === -1) {
      return HttpResponse.json({ message: 'Пользователь не найден' }, { status: 404 })
    }

    // Обновляем пользователя
    users[index] = { ...users[index], ...patch }
    saveUsers(users)

    return HttpResponse.json(users[index])
  }),
]
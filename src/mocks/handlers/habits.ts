import { http, HttpResponse, delay } from 'msw'
import type { Habit, CreateHabitInput, UpdateHabitInput } from '@/entities/habit'
import { mockHabits } from '../data/habits'

const STORAGE_KEY = 'taskflow-mock-habits'

// Получаем ID текущего пользователя из заголовка Authorization
function getCurrentUserId(request: Request): string {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return 'user-1'
  
  const token = authHeader.replace('Bearer ', '')
  try {
    return atob(token)
  } catch {
    return 'user-1'
  }
}

function getHabits(): Habit[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Habit[]
    } catch {
      return [...mockHabits]
    }
  }
  return [...mockHabits]
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}

export const habitHandlers = [
  // GET /api/habits — список привычек ТОЛЬКО текущего пользователя
  http.get('/api/habits', async ({ request }) => {
    await delay(300)
    const currentUserId = getCurrentUserId(request)
    const habits = getHabits()
    
    // Фильтруем: отдаем только привычки этого юзера
    const userHabits = habits.filter(h => h.userId === currentUserId)
    return HttpResponse.json(userHabits)
  }),

  // GET /api/habits/:id — одна привычка
  http.get('/api/habits/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const habits = getHabits()
    const habit = habits.find((h) => h.id === id)

    if (!habit) {
      return HttpResponse.json({ message: 'Привычка не найдена' }, { status: 404 })
    }

    return HttpResponse.json(habit)
  }),

  // POST /api/habits — создание
  http.post('/api/habits', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as CreateHabitInput
    const habits = getHabits()
    const currentUserId = getCurrentUserId(request)

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: currentUserId, 
      title: input.title,
      description: input.description,
      frequency: input.frequency,
      targetDays: input.targetDays,
      color: input.color,
      completedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    habits.push(newHabit)
    saveHabits(habits)
    return HttpResponse.json(newHabit, { status: 201 })
  }),

  // PATCH /api/habits/:id — обновление
  http.patch('/api/habits/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as UpdateHabitInput
    const habits = getHabits()
    const index = habits.findIndex((h) => h.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Привычка не найдена' }, { status: 404 })
    }

    habits[index] = {
      ...habits[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    saveHabits(habits)
    return HttpResponse.json(habits[index])
  }),

  // DELETE /api/habits/:id — удаление
  http.delete('/api/habits/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    const habits = getHabits()
    const updatedHabits = habits.filter((h) => h.id !== id)
    
    saveHabits(updatedHabits)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/habits/:id/toggle — отметить/снять выполнение
  http.post('/api/habits/:id/toggle', async ({ params, request }) => {
    await delay(200)
    const { id } = params
    const { date } = (await request.json()) as { date: string }
    const habits = getHabits()
    const index = habits.findIndex((h) => h.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Привычка не найдена' }, { status: 404 })
    }

    const habit = habits[index]
    const isCompleted = habit.completedDates.includes(date)

    const updatedDates = isCompleted
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date]

    habits[index] = {
      ...habit,
      completedDates: updatedDates,
      updatedAt: new Date().toISOString(),
    }

    saveHabits(habits)
    return HttpResponse.json(habits[index])
  }),
]
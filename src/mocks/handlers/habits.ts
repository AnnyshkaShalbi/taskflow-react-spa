import { http, HttpResponse, delay } from 'msw'
import type { Habit, CreateHabitInput, UpdateHabitInput } from '@/entities/habit'
import { db } from '../db'
import { getUserIdFromRequest, notFound, unauthorized } from '../lib/auth'

/** Привычка текущего пользователя. Чужая — как несуществующая (404), чтобы не раскрывать id */
const findOwnHabit = (id: string, userId: string) =>
  db.habits.getAll().find((h) => h.id === id && h.userId === userId)

function saveHabit(updated: Habit): Habit {
  const next = { ...updated, updatedAt: new Date().toISOString() }
  db.habits.saveAll(db.habits.getAll().map((h) => (h.id === next.id ? next : h)))
  return next
}

export const habitHandlers = [
  // GET /api/habits — привычки ТОЛЬКО текущего пользователя
  http.get('/api/habits', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    return HttpResponse.json(db.habits.getAll().filter((h) => h.userId === userId))
  }),

  // GET /api/habits/:id — одна привычка
  http.get('/api/habits/:id', async ({ params, request }) => {
    await delay(200)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const habit = findOwnHabit(String(params.id), userId)
    return habit ? HttpResponse.json(habit) : notFound('Привычка не найдена')
  }),

  // POST /api/habits — создание; владелец — текущий пользователь
  http.post('/api/habits', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const input = (await request.json()) as CreateHabitInput
    const now = new Date().toISOString()
    const habit: Habit = {
      id: crypto.randomUUID(),
      userId,
      title: input.title,
      description: input.description,
      frequency: input.frequency,
      targetDays: input.targetDays,
      color: input.color,
      completedDates: [],
      createdAt: now,
      updatedAt: now,
    }

    db.habits.saveAll([...db.habits.getAll(), habit])
    return HttpResponse.json(habit, { status: 201 })
  }),

  // PATCH /api/habits/:id — обновление своей привычки
  http.patch('/api/habits/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const habit = findOwnHabit(String(params.id), userId)
    if (!habit) return notFound('Привычка не найдена')

    const patch = (await request.json()) as UpdateHabitInput
    // userId перезаписываем исходным: «передать» привычку другому пользователю нельзя
    return HttpResponse.json(saveHabit({ ...habit, ...patch, userId: habit.userId }))
  }),

  // DELETE /api/habits/:id — удаление своей привычки
  http.delete('/api/habits/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const habit = findOwnHabit(String(params.id), userId)
    if (!habit) return notFound('Привычка не найдена')

    db.habits.saveAll(db.habits.getAll().filter((h) => h.id !== habit.id))
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/habits/:id/toggle — отметить/снять выполнение за дату
  http.post('/api/habits/:id/toggle', async ({ params, request }) => {
    await delay(200)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const habit = findOwnHabit(String(params.id), userId)
    if (!habit) return notFound('Привычка не найдена')

    const { date } = (await request.json()) as { date: string }
    const completedDates = habit.completedDates.includes(date)
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date]

    return HttpResponse.json(saveHabit({ ...habit, completedDates }))
  }),
]

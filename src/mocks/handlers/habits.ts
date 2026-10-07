import { http, HttpResponse, delay } from 'msw'
import type { Habit, CreateHabitInput, UpdateHabitInput } from '@/entities/habit'
import { mockHabits } from '../data/habits'

let habits: Habit[] = [...mockHabits]

export const habitHandlers = [
  // GET /api/habits — список всех привычек
  http.get('/api/habits', async () => {
    await delay(300)
    return HttpResponse.json(habits)
  }),

  // GET /api/habits/:id — одна привычка
  http.get('/api/habits/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
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

    const newHabit: Habit = {
      id: crypto.randomUUID(),
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
    return HttpResponse.json(newHabit, { status: 201 })
  }),

  // PATCH /api/habits/:id — обновление
  http.patch('/api/habits/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as UpdateHabitInput
    const index = habits.findIndex((h) => h.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Привычка не найдена' }, { status: 404 })
    }

    habits[index] = {
      ...habits[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(habits[index])
  }),

  // DELETE /api/habits/:id — удаление
  http.delete('/api/habits/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    habits = habits.filter((h) => h.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/habits/:id/toggle — отметить/снять выполнение сегодня
  http.post('/api/habits/:id/toggle', async ({ params, request }) => {
    await delay(200)
    const { id } = params
    const { date } = (await request.json()) as { date: string }
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

    return HttpResponse.json(habits[index])
  }),
]

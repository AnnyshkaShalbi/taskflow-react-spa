import { http, HttpResponse, delay } from 'msw'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/entities/task'
import { mockTasks } from '../data/tasks'

const STORAGE_KEY = 'taskflow-mock-tasks'

// Вспомогательная функция: читает задачи из localStorage (или отдаёт seed)
export function getTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Task[]
    } catch {
      return [...mockTasks]
    }
  }
  return [...mockTasks]
}

// Вспомогательная функция: сохраняет задачи в localStorage
export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const taskHandlers = [
  // GET /api/tasks — список
  http.get('/api/tasks', async () => {
    await delay(300)
    return HttpResponse.json(getTasks())
  }),

  // POST /api/tasks — создание
  http.post('/api/tasks', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as CreateTaskInput
    const tasks = getTasks()

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      boardId: input.boardId,
      assigneeId: input.assigneeId,
      tags: input.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    saveTasks(tasks)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  // PATCH /api/tasks/:id — обновление
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as UpdateTaskInput
    const tasks = getTasks()
    const index = tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Задача не найдена' }, { status: 404 })
    }

    tasks[index] = {
      ...tasks[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    saveTasks(tasks)
    return HttpResponse.json(tasks[index])
  }),

  // DELETE /api/tasks/:id — удаление
  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    const tasks = getTasks().filter((t) => t.id !== id)
    saveTasks(tasks)
    return new HttpResponse(null, { status: 204 })
  }),
]
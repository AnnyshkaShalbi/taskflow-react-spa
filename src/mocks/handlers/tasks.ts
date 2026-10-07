import { http, HttpResponse, delay } from 'msw'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/entities/task'
import { mockTasks } from '../data/tasks'

let tasks: Task[] = [...mockTasks]

export const taskHandlers = [
  http.get('/api/tasks', async () => {
    await delay(300)
    return HttpResponse.json(tasks)
  }),

  http.post('/api/tasks', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as CreateTaskInput

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
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as UpdateTaskInput
    const index = tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    tasks[index] = {
      ...tasks[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(tasks[index])
  }),

  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    tasks = tasks.filter((t) => t.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]

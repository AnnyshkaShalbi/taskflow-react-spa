import { http, HttpResponse, delay } from 'msw'
import type { Board, CreateBoardInput } from '@/entities/board'
import { mockBoards } from '../data/boards'

let boards: Board[] = [...mockBoards]

export const boardHandlers = [
  // GET /api/boards — список всех досок текущего пользователя
  // (в моке считаем, что текущий — user-1)
  http.get('/api/boards', async () => {
    await delay(300)
    const currentUserId = 'user-1'
    const userBoards = boards.filter(
      (b) => b.ownerId === currentUserId || b.memberIds.includes(currentUserId),
    )
    return HttpResponse.json(userBoards)
  }),

  // GET /api/boards/:id — одна доска
  http.get('/api/boards/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const board = boards.find((b) => b.id === id)

    if (!board) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    return HttpResponse.json(board)
  }),

  // POST /api/boards — создание
  http.post('/api/boards', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as CreateBoardInput

    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      ownerId: 'user-1', // текущий пользователь
      memberIds: [],
      isPublic: input.isPublic ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    boards.push(newBoard)
    return HttpResponse.json(newBoard, { status: 201 })
  }),

  // PATCH /api/boards/:id — обновление
  http.patch('/api/boards/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as Partial<Board>
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    boards[index] = {
      ...boards[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(boards[index])
  }),

  // DELETE /api/boards/:id — удаление
  http.delete('/api/boards/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    boards = boards.filter((b) => b.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/boards/:id/members — добавить участника
  http.post('/api/boards/:id/members', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const { userId } = (await request.json()) as { userId: string }
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    const board = boards[index]

    if (board.memberIds.includes(userId)) {
      return HttpResponse.json({ message: 'Пользователь уже участник' }, { status: 409 })
    }

    boards[index] = {
      ...board,
      memberIds: [...board.memberIds, userId],
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(boards[index])
  }),

  // DELETE /api/boards/:id/members/:userId — убрать участника
  http.delete('/api/boards/:id/members/:userId', async ({ params }) => {
    await delay(300)
    const { id, userId } = params
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    boards[index] = {
      ...boards[index],
      memberIds: boards[index].memberIds.filter((m) => m !== userId),
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(boards[index])
  }),
]

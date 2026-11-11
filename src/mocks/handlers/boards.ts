import { http, HttpResponse, delay } from 'msw'
import type { Board, CreateBoardInput } from '@/entities/board'
import { mockBoards } from '../data/boards'
import { getTasks, saveTasks } from './tasks'

const STORAGE_KEY = 'taskflow-mock-boards'

// Получаем ID текущего пользователя из токена
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

function getBoards(): Board[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Board[]
    } catch {
      return [...mockBoards]
    }
  }
  return [...mockBoards]
}

function saveBoards(boards: Board[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
}

export const boardHandlers = [
  // 1. GET /api/boards — список досок текущего пользователя
  http.get('/api/boards', async ({ request }) => {
    await delay(300)
    const currentUserId = getCurrentUserId(request)
    const boards = getBoards()
    
    const userBoards = boards.filter(
      (b) => b.ownerId === currentUserId || b.memberIds.includes(currentUserId),
    )
    return HttpResponse.json(userBoards)
  }),

  // 2. GET /api/boards/:id — одна доска
  http.get('/api/boards/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const boards = getBoards()
    const board = boards.find((b) => b.id === id)

    if (!board) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    return HttpResponse.json(board)
  }),

  // 3. POST /api/boards — создание новой доски
  http.post('/api/boards', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as CreateBoardInput
    const boards = getBoards()
    const currentUserId = getCurrentUserId(request)

    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      ownerId: currentUserId,
      memberIds: [],
      isPublic: input.isPublic ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    boards.push(newBoard)
    saveBoards(boards)
    return HttpResponse.json(newBoard, { status: 201 })
  }),

  // 4. PATCH /api/boards/:id — обновление доски
  http.patch('/api/boards/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const patch = (await request.json()) as Partial<Board>
    const boards = getBoards()
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    boards[index] = {
      ...boards[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    saveBoards(boards)
    return HttpResponse.json(boards[index])
  }),

  // 5. DELETE /api/boards/:id — удаление доски (С ПРОВЕРКОЙ ПРАВ)
  http.delete('/api/boards/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const currentUserId = getCurrentUserId(request)
    
    const boards = getBoards()
    const board = boards.find((b) => b.id === id)

    if (!board) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    // БЛОКИРОВКА: Если текущий юзер не владелец, выдаем ошибку 403 Forbidden
    if (board.ownerId !== currentUserId) {
      return HttpResponse.json({ message: 'Нет прав на удаление этой доски' }, { status: 403 })
    }

    // Удаляем доску
    saveBoards(boards.filter((b) => b.id !== id))

    // Каскадно удаляем задачи
    const tasks = getTasks()
    saveTasks(tasks.filter((t) => t.boardId !== id))

    return new HttpResponse(null, { status: 204 })
  }),

  // 6. POST /api/boards/:id/members — добавить участника по email
  http.post('/api/boards/:id/members', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const { email } = (await request.json()) as { email: string }
    
    const boards = getBoards()
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    const { mockUsers } = await import('../data/users')
    const userToAdd = mockUsers.find(u => u.email === email)

    if (!userToAdd) {
      return HttpResponse.json({ message: 'Пользователь с таким email не найден' }, { status: 404 })
    }

    const board = boards[index]

    if (board.memberIds.includes(userToAdd.id)) {
      return HttpResponse.json({ message: 'Пользователь уже участник' }, { status: 409 })
    }

    boards[index] = {
      ...board,
      memberIds: [...board.memberIds, userToAdd.id],
      updatedAt: new Date().toISOString(),
    }

    saveBoards(boards)
    return HttpResponse.json(boards[index])
  }),

  // 7. DELETE /api/boards/:id/members/:userId — убрать участника из доски
  http.delete('/api/boards/:id/members/:userId', async ({ params }) => {
    await delay(300)
    const { id, userId } = params
    const boards = getBoards()
    const index = boards.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Доска не найдена' }, { status: 404 })
    }

    boards[index] = {
      ...boards[index],
      memberIds: boards[index].memberIds.filter((m) => m !== userId),
      updatedAt: new Date().toISOString(),
    }

    saveBoards(boards)
    return HttpResponse.json(boards[index])
  }),
]
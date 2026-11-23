import { http, HttpResponse, delay } from 'msw'
import type { Board, CreateBoardInput } from '@/entities/board'
import { db } from '../db'
import { forbidden, getUserIdFromRequest, notFound, unauthorized } from '../lib/auth'
import { findBoard, isBoardMember, isBoardOwner } from '../lib/access'

/** Сохранить изменённую доску (обновляет updatedAt) */
function saveBoard(updated: Board): Board {
  const next = { ...updated, updatedAt: new Date().toISOString() }
  db.boards.saveAll(db.boards.getAll().map((b) => (b.id === next.id ? next : b)))
  return next
}

export const boardHandlers = [
  // GET /api/boards — доски, где пользователь владелец или участник
  http.get('/api/boards', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    return HttpResponse.json(db.boards.getAll().filter((b) => isBoardMember(b, userId)))
  }),

  // GET /api/boards/:id — одна доска (только для участников)
  http.get('/api/boards/:id', async ({ params, request }) => {
    await delay(200)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const board = findBoard(String(params.id))
    // Чужая доска отвечает 404, а не 403: не раскрываем, что такая доска существует
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')

    return HttpResponse.json(board)
  }),

  // POST /api/boards — создание; владелец — текущий пользователь
  http.post('/api/boards', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const input = (await request.json()) as CreateBoardInput
    const now = new Date().toISOString()
    const board: Board = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      ownerId: userId,
      memberIds: [],
      isPublic: input.isPublic ?? false,
      createdAt: now,
      updatedAt: now,
    }

    db.boards.saveAll([...db.boards.getAll(), board])
    return HttpResponse.json(board, { status: 201 })
  }),

  // PATCH /api/boards/:id — изменение названия/описания (только владелец)
  http.patch('/api/boards/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const board = findBoard(String(params.id))
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')
    if (!isBoardOwner(board, userId)) return forbidden('Изменять доску может только владелец')

    // Владельца и участников через PATCH не меняем — для этого отдельные эндпоинты
    const { title, description, isPublic } = (await request.json()) as Partial<Board>
    return HttpResponse.json(
      saveBoard({
        ...board,
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
      }),
    )
  }),

  // DELETE /api/boards/:id — удаление (только владелец), каскадно с задачами
  http.delete('/api/boards/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const board = findBoard(String(params.id))
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')
    if (!isBoardOwner(board, userId)) return forbidden('Нет прав на удаление этой доски')

    // Каскад: доска → её задачи → комментарии к этим задачам
    const removedTaskIds = new Set(
      db.tasks.getAll().filter((t) => t.boardId === board.id).map((t) => t.id),
    )
    db.boards.saveAll(db.boards.getAll().filter((b) => b.id !== board.id))
    db.tasks.saveAll(db.tasks.getAll().filter((t) => !removedTaskIds.has(t.id)))
    db.comments.saveAll(db.comments.getAll().filter((c) => !removedTaskIds.has(c.taskId)))
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/boards/:id/members — пригласить участника по email (только владелец)
  http.post('/api/boards/:id/members', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const board = findBoard(String(params.id))
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')
    if (!isBoardOwner(board, userId)) return forbidden('Приглашать участников может только владелец доски')

    const { email } = (await request.json()) as { email: string }
    const invitee = db.users.getAll().find((u) => u.email === email)
    if (!invitee) return notFound('Пользователь с таким email не найден')
    if (isBoardMember(board, invitee.id)) {
      return HttpResponse.json({ message: 'Пользователь уже участник' }, { status: 409 })
    }

    return HttpResponse.json(saveBoard({ ...board, memberIds: [...board.memberIds, invitee.id] }))
  }),

  // DELETE /api/boards/:id/members/:userId — удалить участника (только владелец)
  http.delete('/api/boards/:id/members/:memberId', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const board = findBoard(String(params.id))
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')
    if (!isBoardOwner(board, userId)) return forbidden('Удалять участников может только владелец доски')

    const memberId = String(params.memberId)
    return HttpResponse.json(
      saveBoard({ ...board, memberIds: board.memberIds.filter((id) => id !== memberId) }),
    )
  }),
]

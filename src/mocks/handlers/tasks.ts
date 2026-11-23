import { http, HttpResponse, delay } from 'msw'
import {
  applyTaskPatch,
  type Task,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '@/entities/task'
import { db } from '../db'
import { badRequest, getUserIdFromRequest, notFound, unauthorized } from '../lib/auth'
import { findBoard, getAccessibleBoardIds, isBoardMember } from '../lib/access'

/** Задача, доступная пользователю (он участник её доски). Иначе — как несуществующая */
function findAccessibleTask(id: string, userId: string) {
  const task = db.tasks.getAll().find((t) => t.id === id)
  if (!task) return undefined
  const board = findBoard(task.boardId)
  return board && isBoardMember(board, userId) ? task : undefined
}

/** Исполнителем можно назначить только участника доски задачи */
function isValidAssignee(boardId: string, assigneeId: string | null | undefined) {
  if (!assigneeId) return true // не назначен / снять исполнителя
  const board = findBoard(boardId)
  return !!board && isBoardMember(board, assigneeId)
}

export const taskHandlers = [
  // GET /api/tasks — задачи всех досок, доступных пользователю
  http.get('/api/tasks', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const boardIds = getAccessibleBoardIds(userId)
    return HttpResponse.json(db.tasks.getAll().filter((t) => boardIds.has(t.boardId)))
  }),

  // POST /api/tasks — создание (только на своей доске)
  http.post('/api/tasks', async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const input = (await request.json()) as CreateTaskInput
    const board = findBoard(input.boardId)
    if (!board || !isBoardMember(board, userId)) return notFound('Доска не найдена')
    if (!isValidAssignee(board.id, input.assigneeId)) {
      return badRequest('Исполнителем можно назначить только участника доски')
    }

    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      boardId: board.id,
      assigneeId: input.assigneeId,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    }

    db.tasks.saveAll([...db.tasks.getAll(), task])
    return HttpResponse.json(task, { status: 201 })
  }),

  // PATCH /api/tasks/:id — обновление (любой участник доски)
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const task = findAccessibleTask(String(params.id), userId)
    if (!task) return notFound('Задача не найдена')

    const patch = (await request.json()) as UpdateTaskInput
    if (!isValidAssignee(task.boardId, patch.assigneeId)) {
      return badRequest('Исполнителем можно назначить только участника доски')
    }

    // null в патче = очистить поле (снять исполнителя, убрать срок)
    // boardId перезаписываем исходным — перенос задачи между досками через PATCH не поддерживаем
    const updated: Task = {
      ...applyTaskPatch(task, patch),
      boardId: task.boardId,
      updatedAt: new Date().toISOString(),
    }
    db.tasks.saveAll(db.tasks.getAll().map((t) => (t.id === task.id ? updated : t)))
    return HttpResponse.json(updated)
  }),

  // DELETE /api/tasks/:id — удаление (любой участник доски), каскадно с комментариями
  http.delete('/api/tasks/:id', async ({ params, request }) => {
    await delay(300)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const task = findAccessibleTask(String(params.id), userId)
    if (!task) return notFound('Задача не найдена')

    db.tasks.saveAll(db.tasks.getAll().filter((t) => t.id !== task.id))
    // Каскадно удаляем комментарии задачи — как сделал бы настоящий бэкенд (ON DELETE CASCADE)
    db.comments.saveAll(db.comments.getAll().filter((c) => c.taskId !== task.id))
    return new HttpResponse(null, { status: 204 })
  }),
]

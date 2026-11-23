import { http, HttpResponse, delay } from 'msw'
import type { Comment, CreateCommentInput } from '@/entities/comment'
import { db } from '../db'
import { badRequest, forbidden, getUserIdFromRequest, notFound, unauthorized } from '../lib/auth'
import { findBoard, isBoardMember } from '../lib/access'

/** Комментировать и читать комментарии могут участники доски, к которой относится задача */
function canAccessTask(taskId: string, userId: string) {
  const task = db.tasks.getAll().find((t) => t.id === taskId)
  const board = task && findBoard(task.boardId)
  return !!board && isBoardMember(board, userId)
}

export const commentHandlers = [
  // GET /api/tasks/:taskId/comments — комментарии задачи, старые сверху
  http.get('/api/tasks/:taskId/comments', async ({ params, request }) => {
    await delay(250)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const taskId = String(params.taskId)
    if (!canAccessTask(taskId, userId)) return notFound('Задача не найдена')

    const comments = db.comments
      .getAll()
      .filter((c) => c.taskId === taskId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return HttpResponse.json(comments)
  }),

  // POST /api/tasks/:taskId/comments — автор берётся из токена, а не из тела запроса
  http.post('/api/tasks/:taskId/comments', async ({ params, request }) => {
    await delay(400)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const taskId = String(params.taskId)
    if (!canAccessTask(taskId, userId)) return notFound('Задача не найдена')

    const { text } = (await request.json()) as CreateCommentInput
    const trimmed = text?.trim() ?? ''
    if (!trimmed) return badRequest('Комментарий не может быть пустым')

    const comment: Comment = {
      id: crypto.randomUUID(),
      taskId,
      authorId: userId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    db.comments.saveAll([...db.comments.getAll(), comment])
    return HttpResponse.json(comment, { status: 201 })
  }),

  // DELETE /api/comments/:id — удалить можно только свой комментарий
  http.delete('/api/comments/:id', async ({ params, request }) => {
    await delay(250)
    const userId = getUserIdFromRequest(request)
    if (!userId) return unauthorized()

    const comment = db.comments.getAll().find((c) => c.id === params.id)
    if (!comment) return notFound('Комментарий не найден')
    if (comment.authorId !== userId) return forbidden('Можно удалить только свой комментарий')

    db.comments.saveAll(db.comments.getAll().filter((c) => c.id !== comment.id))
    return new HttpResponse(null, { status: 204 })
  }),
]

import { http, HttpResponse, delay } from 'msw'
import type { Comment, CreateCommentInput } from '@/entities/comment'
import { mockComments } from '../data/comments'

const STORAGE_KEY = 'taskflow-mock-comments'

function getComments(): Comment[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Comment[]
    } catch {
      return [...mockComments]
    }
  }
  return [...mockComments]
}

function saveComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
}

/** Удалить все комментарии задачи — вызывается при удалении задачи */
export function deleteCommentsByTask(taskId: string) {
  saveComments(getComments().filter((c) => c.taskId !== taskId))
}

// Токен — base64(userId), как в auth-хендлерах
function getUserIdFromRequest(request: Request): string | null {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    return atob(token) || null
  } catch {
    return null
  }
}

export const commentHandlers = [
  // GET /api/tasks/:taskId/comments — комментарии задачи, старые сверху
  http.get('/api/tasks/:taskId/comments', async ({ params }) => {
    await delay(250)
    const comments = getComments()
      .filter((c) => c.taskId === params.taskId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return HttpResponse.json(comments)
  }),

  // POST /api/tasks/:taskId/comments — автор берётся из токена, а не из тела запроса
  http.post('/api/tasks/:taskId/comments', async ({ params, request }) => {
    await delay(400)
    const authorId = getUserIdFromRequest(request)
    if (!authorId) {
      return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    }

    const { text } = (await request.json()) as CreateCommentInput
    const trimmed = text?.trim() ?? ''
    if (!trimmed) {
      return HttpResponse.json({ message: 'Комментарий не может быть пустым' }, { status: 400 })
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      taskId: String(params.taskId),
      authorId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    saveComments([...getComments(), comment])
    return HttpResponse.json(comment, { status: 201 })
  }),

  // DELETE /api/comments/:id — удалить можно только свой комментарий
  http.delete('/api/comments/:id', async ({ params, request }) => {
    await delay(250)
    const userId = getUserIdFromRequest(request)
    const comments = getComments()
    const comment = comments.find((c) => c.id === params.id)

    if (!comment) {
      return HttpResponse.json({ message: 'Комментарий не найден' }, { status: 404 })
    }
    if (comment.authorId !== userId) {
      return HttpResponse.json({ message: 'Можно удалить только свой комментарий' }, { status: 403 })
    }

    saveComments(comments.filter((c) => c.id !== params.id))
    return new HttpResponse(null, { status: 204 })
  }),
]

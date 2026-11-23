import type { Comment } from '@/entities/comment'

const minutesAgo = (minutes: number): string => new Date(Date.now() - minutes * 60_000).toISOString()

// Стартовые комментарии: переписка разных пользователей — чтобы сразу было видно авторов и права
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    taskId: 'task-2',
    authorId: 'user-1',
    text: 'Иван, глянь, пожалуйста, требования к мобильной версии — добавила в описание.',
    createdAt: minutesAgo(60 * 26),
  },
  {
    id: 'comment-2',
    taskId: 'task-2',
    authorId: 'user-2',
    text: 'Посмотрел 👍 Табы над лентой — отличная идея. Начну с сенсоров для тача.',
    createdAt: minutesAgo(60 * 3),
  },
  {
    id: 'comment-3',
    taskId: 'task-3',
    authorId: 'user-3',
    text: 'Не успеваю к сроку, нужен ещё день — разбираюсь с моками стора.',
    createdAt: minutesAgo(40),
  },
  {
    id: 'comment-4',
    taskId: 'task-1',
    authorId: 'user-1',
    text: 'Хендлеры для задач и досок готовы, осталась авторизация.',
    createdAt: minutesAgo(15),
  },
]
